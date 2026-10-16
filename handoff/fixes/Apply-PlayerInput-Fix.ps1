[CmdletBinding()]
param([Parameter(Mandatory)][string]$ProjectPath)

# Applies only the verified CS1612 fix to PlayerInput.cs. The Unity .meta file
# and every other Windows asset remain in place.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$oldHash = '4cdefd1a991335c8bf6c5412ac23427082cadc3ca52c5611b34bc6bbd5990bee'
$newHash = '72e949fa4ca55c6dd987039d364bc65a60497f47044fd3fb32e5c0474b7180d7'
$project = [IO.Path]::GetFullPath($ProjectPath).TrimEnd([IO.Path]::DirectorySeparatorChar)
$target = Join-Path $project 'Assets/_VelvetVendetta/Gameplay/PlayerInput.cs'
$fixed = Join-Path $PSScriptRoot 'PlayerInput.cs'

function Assert-NoLinkedAncestor([string]$Path) {
    $cursor = [IO.Path]::GetFullPath($Path)
    while (-not [string]::IsNullOrWhiteSpace($cursor)) {
        if (Test-Path -LiteralPath $cursor) {
            $item = Get-Item -LiteralPath $cursor -Force -ErrorAction Stop
            if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) {
                throw "Linked path needs separate review: $cursor"
            }
        }
        $parent = [IO.Path]::GetDirectoryName($cursor)
        if ([string]::IsNullOrWhiteSpace($parent) -or $parent -eq $cursor) { break }
        $cursor = $parent
    }
}
function Hash-Lower([string]$Path) {
    return (Get-FileHash -LiteralPath $Path -Algorithm SHA256 -ErrorAction Stop).Hash.ToLowerInvariant()
}

Assert-NoLinkedAncestor $project
Assert-NoLinkedAncestor $target
Assert-NoLinkedAncestor $fixed
if (-not (Test-Path -LiteralPath $target -PathType Leaf) -or
    -not (Test-Path -LiteralPath $fixed -PathType Leaf)) {
    throw 'PlayerInput.cs or the reviewed fix file is missing.'
}
# Git may check text out with CRLF on Windows. Verify the exact reviewed source
# after normalizing only CRLF, then stage those verified LF bytes.
$utf8 = New-Object System.Text.UTF8Encoding($false, $true)
try {
    $fixedText = $utf8.GetString([IO.File]::ReadAllBytes($fixed))
} catch {
    throw 'The fix file is not valid UTF-8.'
}
$canonicalBytes = $utf8.GetBytes($fixedText.Replace("`r`n", "`n"))
$sha256 = [Security.Cryptography.SHA256]::Create()
try {
    $canonicalHash = [BitConverter]::ToString($sha256.ComputeHash($canonicalBytes)).Replace('-', '').ToLowerInvariant()
} finally {
    $sha256.Dispose()
}
if ($canonicalHash -ne $newHash) { throw 'The fix file failed its integrity check.' }
$currentHash = Hash-Lower $target
if ($currentHash -eq $newHash) { Write-Output 'PlayerInput.cs already has the verified fix.'; exit 0 }
if ($currentHash -ne $oldHash) {
    throw "Windows PlayerInput.cs differs from the handoff version ($currentHash). Review it before applying this fix."
}

$backup = Join-Path ([IO.Path]::GetDirectoryName($project)) (
    [IO.Path]::GetFileName($project) + '-playerinput-backup-' +
    [DateTime]::Now.ToString('yyyyMMdd-HHmmss') + '-' + [Guid]::NewGuid().ToString('N').Substring(0, 6))
Assert-NoLinkedAncestor $backup
[void][IO.Directory]::CreateDirectory($backup)
Assert-NoLinkedAncestor $backup
$backupFile = Join-Path $backup 'PlayerInput.cs'
[IO.File]::Copy($target, $backupFile, $false)
if ((Hash-Lower $backupFile) -ne $oldHash -or (Hash-Lower $target) -ne $oldHash) {
    throw "Source changed while backing up. No fix applied. Backup: $backup"
}

$temporary = Join-Path ([IO.Path]::GetDirectoryName($target)) (
    'PlayerInput.cs.act0fix-' + [Guid]::NewGuid().ToString('N') + '.tmp')
Assert-NoLinkedAncestor $temporary
[IO.File]::WriteAllBytes($temporary, $canonicalBytes)
if ((Hash-Lower $temporary) -ne $newHash -or (Hash-Lower $target) -ne $oldHash) {
    throw "Source changed while staging fix. No fix applied. Backup: $backup"
}
$replaceBackup = Join-Path $backup 'PlayerInput.replaced.cs'
[IO.File]::Replace($temporary, $target, $replaceBackup)
if ((Hash-Lower $target) -ne $newHash -or (Hash-Lower $replaceBackup) -ne $oldHash) {
    throw "Fixed file failed verification. Restore from backup: $backupFile"
}
Write-Output "Fixed PlayerInput.cs. Original file backed up at: $backupFile"
Write-Output 'The PlayerInput.cs.meta GUID and all other Unity files are unchanged.'
