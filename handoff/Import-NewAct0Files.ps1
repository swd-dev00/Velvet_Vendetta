[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$ProjectPath,
    [Parameter(Mandatory)][string]$HandoffPath,
    [Parameter(Mandatory)][string]$ComparisonPath
)

# Windows import gate. It checkpoints the Unity project source before adding
# exactly the 45 absent handoff files. It never replaces an existing path.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$project = [IO.Path]::GetFullPath($ProjectPath).TrimEnd([IO.Path]::DirectorySeparatorChar)
$handoff = [IO.Path]::GetFullPath($HandoffPath).TrimEnd([IO.Path]::DirectorySeparatorChar)
if (-not (Test-Path -LiteralPath (Join-Path $project 'Assets') -PathType Container)) {
    throw "Unity Assets folder not found: $project"
}
$helper = Join-Path $handoff 'Stage-Act0-Hardening.ps1'
if (-not (Test-Path -LiteralPath $helper -PathType Leaf)) { throw "Handoff helper not found: $helper" }
. $helper
Assert-ExternalReviewPath -ReviewPath $handoff -ProjectPath $project
Assert-Act0UnlinkedAncestors $project

function Join-CheckedPath([string]$Root, [string]$Relative) {
    if ([string]::IsNullOrWhiteSpace($Relative) -or [IO.Path]::IsPathRooted($Relative) -or
        $Relative.Contains(':') -or -not $Relative.StartsWith('Assets/', [StringComparison]::Ordinal)) {
        throw "Unsafe asset path: $Relative"
    }
    $rootFull = [IO.Path]::GetFullPath($Root).TrimEnd([IO.Path]::DirectorySeparatorChar)
    $candidate = [IO.Path]::GetFullPath((Join-Path $rootFull $Relative.Replace('/', [IO.Path]::DirectorySeparatorChar)))
    if (-not $candidate.StartsWith($rootFull + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Asset path leaves root: $Relative"
    }
    return $candidate
}
function Hash-Lower([string]$Path) {
    return (Get-FileHash -LiteralPath $Path -Algorithm SHA256 -ErrorAction Stop).Hash.ToLowerInvariant()
}

$manifestPath = Join-Path $handoff 'manifest.json'
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
if ($manifest.format -ne 1 -or @($manifest.files).Count -ne 50) { throw 'Unexpected handoff manifest.' }
$comparison = Get-Content -LiteralPath $ComparisonPath -Raw | ConvertFrom-Json
$reportedProject = [IO.Path]::GetFullPath([string]$comparison.project).TrimEnd([IO.Path]::DirectorySeparatorChar)
if (-not $reportedProject.Equals($project, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Comparison report belongs to a different Unity project.'
}
if (@($comparison.files).Count -ne 50) { throw 'Comparison report does not cover all 50 handoff paths.' }
if ($comparison.source_base_commit -ne $manifest.base_commit) {
    throw 'Comparison report was produced from a different handoff baseline.'
}
$protected = @(
    'Assets/_VelvetVendetta.meta',
    'Assets/_VelvetVendetta/Core.meta',
    'Assets/_VelvetVendetta/Core/GameBootstrap.cs.meta',
    'Assets/_VelvetVendetta/Scenes.meta',
    'Assets/_VelvetVendetta/Core/GameBootstrap.cs'
)
foreach ($collision in $comparison.duplicate_incoming_guids) {
    if ($protected -notcontains $collision.incoming) {
        throw "An imported GUID collides with a Windows asset: $($collision.incoming)"
    }
}
$manifestByPath = @{}
$reportByPath = @{}
foreach ($row in $comparison.files) {
    if ($reportByPath.ContainsKey($row.path)) { throw "Duplicate comparison path: $($row.path)" }
    $reportByPath[$row.path] = $row
}
$incoming = @()
foreach ($entry in $manifest.files) {
    if ($manifestByPath.ContainsKey($entry.path)) { throw "Duplicate manifest path: $($entry.path)" }
    $manifestByPath[$entry.path] = $true
    if (-not $reportByPath.ContainsKey($entry.path)) { throw "Comparison path missing: $($entry.path)" }
    $source = Join-CheckedPath (Join-Path $handoff 'cloud') $entry.path
    $destination = Join-CheckedPath $project $entry.path
    Assert-Act0UnlinkedAncestors $source
    Assert-Act0UnlinkedAncestors $destination
    if (-not (Test-Path -LiteralPath $source -PathType Leaf) -or (Hash-Lower $source) -ne $entry.sha256) {
        throw "Incoming payload is missing or changed: $($entry.path)"
    }
    $row = $reportByPath[$entry.path]
    if ($protected -contains $entry.path) {
        if (-not (Test-Path -LiteralPath $destination -PathType Leaf) -or
            @('identical', 'different-existing-file') -notcontains $row.status -or
            (Hash-Lower $destination) -ne $row.existing_sha256) {
            throw "Protected Windows asset changed since staging: $($entry.path)"
        }
    } else {
        if ($entry.status -ne 'new' -or $row.status -ne 'new-path' -or
            (Test-Path -LiteralPath $destination)) {
            throw "Expected an absent new path: $($entry.path)"
        }
        $incoming += $entry
    }
}
if ($incoming.Count -ne 45 -or $manifestByPath.Count -ne 50 -or $reportByPath.Count -ne 50) {
    throw 'The Windows checkout does not match the 45-new / 5-existing import plan.'
}

# Generated Unity folders can be recreated. All other files, including untracked
# Assets, Packages, ProjectSettings, UserSettings and local scene files, are copied.
$excludedRootDirectories = @('Library', 'Temp', 'Obj', 'Logs', '.vs')
function Get-CheckpointFiles([string]$Directory, [string]$Relative) {
    Assert-Act0UnlinkedAncestors $Directory
    foreach ($item in Get-ChildItem -LiteralPath $Directory -Force -ErrorAction Stop) {
        if ($Relative -eq '' -and $item.PSIsContainer -and $excludedRootDirectories -contains $item.Name) {
            continue
        }
        if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) {
            throw "Linked source path prevents a complete checkpoint: $($item.FullName)"
        }
        $child = if ($Relative -eq '') { $item.Name } else { $Relative + '/' + $item.Name }
        if ($item.PSIsContainer) {
            Get-CheckpointFiles -Directory $item.FullName -Relative $child
        } else {
            [pscustomobject]@{ path = $child; source = $item.FullName }
        }
    }
}

$sourceFiles = @(Get-CheckpointFiles -Directory $project -Relative '')
$before = @{}
foreach ($file in $sourceFiles) {
    if ($before.ContainsKey($file.path)) { throw "Case-insensitive checkpoint path collision: $($file.path)" }
    $before[$file.path] = Hash-Lower $file.source
}
$checkpoint = Join-Path ([IO.Path]::GetDirectoryName($project)) (
    [IO.Path]::GetFileName($project) + '-act0-checkpoint-' +
    [DateTime]::Now.ToString('yyyyMMdd-HHmmss') + '-' + [Guid]::NewGuid().ToString('N').Substring(0, 6))
Assert-ExternalReviewPath -ReviewPath $checkpoint -ProjectPath $project
if (Test-Path -LiteralPath $checkpoint) { throw "Checkpoint already exists: $checkpoint" }
[void][IO.Directory]::CreateDirectory($checkpoint)
Assert-ExternalReviewPath -ReviewPath $checkpoint -ProjectPath $project

foreach ($file in $sourceFiles) {
    $target = [IO.Path]::GetFullPath((Join-Path $checkpoint $file.path.Replace('/', [IO.Path]::DirectorySeparatorChar)))
    $parent = [IO.Path]::GetDirectoryName($target)
    Assert-ExternalReviewPath -ReviewPath $parent -ProjectPath $project
    [void][IO.Directory]::CreateDirectory($parent)
    Assert-ExternalReviewPath -ReviewPath $parent -ProjectPath $project
    [IO.File]::Copy($file.source, $target, $false)
    if ((Hash-Lower $target) -ne $before[$file.path] -or
        (Hash-Lower $file.source) -ne $before[$file.path]) {
        throw "Project changed during checkpoint: $($file.path). No Act 0 files were imported."
    }
}
$afterFiles = @(Get-CheckpointFiles -Directory $project -Relative '')
if ($afterFiles.Count -ne $before.Count) { throw 'Project file inventory changed during checkpoint.' }
foreach ($file in $afterFiles) {
    $target = [IO.Path]::GetFullPath((Join-Path $checkpoint $file.path.Replace('/', [IO.Path]::DirectorySeparatorChar)))
    if (-not $before.ContainsKey($file.path) -or
        (Hash-Lower $file.source) -ne $before[$file.path] -or (Hash-Lower $target) -ne $before[$file.path]) {
        throw "Project file changed during checkpoint: $($file.path). No Act 0 files were imported."
    }
}
$checkpointManifest = Join-Path $checkpoint 'act0-checkpoint-manifest.json'
$before | ConvertTo-Json -Depth 3 | Set-Content -LiteralPath $checkpointManifest -Encoding UTF8
Write-Output "Checkpoint verified: $checkpoint"

$copied = @()
foreach ($entry in $incoming) {
    $source = Join-CheckedPath (Join-Path $handoff 'cloud') $entry.path
    $destination = Join-CheckedPath $project $entry.path
    if (Test-Path -LiteralPath $destination) { throw "Destination appeared during import: $($entry.path)" }
    if ((Hash-Lower $source) -ne $entry.sha256) { throw "Payload changed during import: $($entry.path)" }
    $parent = [IO.Path]::GetDirectoryName($destination)
    Assert-Act0UnlinkedAncestors $parent
    [void][IO.Directory]::CreateDirectory($parent)
    Assert-Act0UnlinkedAncestors $parent
    [IO.File]::Copy($source, $destination, $false)
    if ((Hash-Lower $destination) -ne $entry.sha256) {
        throw "Copied file failed verification: $($entry.path). Checkpoint: $checkpoint"
    }
    $copied += $entry.path
}
if ($copied.Count -ne 45) { throw "Incomplete Act 0 import. Checkpoint: $checkpoint" }
$copied | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $checkpoint 'act0-imported-paths.json') -Encoding UTF8
Write-Output 'Imported exactly 45 new Act 0 paths. All five existing paths were preserved.'
Write-Output 'Unity has not been launched. Compile in the existing Editor before running static validation.'
