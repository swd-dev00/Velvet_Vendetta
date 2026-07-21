## Summary

Transforms Velvet Vendetta from a playable vertical slice into a structured Phaser campaign with persistent combat, mission progression, and five authored operations across Kentahten.

## What changed

- Adds weapon draw/conceal, pointer aiming, ammunition, reloads, projectile collisions, NPC health, downed states, and wanted/reputation consequences.
- Adds a data-driven five-mission campaign manager:
  - Bluegrass Surveillance
  - The Transit Ambush
  - Velvet Lockdown
  - Hollows Retaliation
  - The Kentahten Sovereign
- Adds mission-specific initialization, objectives, failure conditions, retry, completion, unlocks, and campaign victory handling.
- Adds enemy projectile combat, health, Velvet Flow, mission markers, HUD directives, keyboard controls, and touch controls.
- Persists character, combat, faction, Vendetta Memory, and campaign state across sessions.
- Updates documentation and automated regression coverage.

## Why

The earlier implementation behaved primarily as a sandbox and did not provide a continuous, authored progression loop. This change introduces explicit mission state, reusable campaign boundaries, and verifiable success/failure conditions so the game can function as an actual campaign.

## Validation

- 8 automated tests pass.
- TypeScript/Vite production build succeeds.
- Git history and bundle were verified by cloning.

## Remaining QA

- Visual browser screenshot QA is still required because the available headless Chromium environment could not complete a Phaser capture session.
