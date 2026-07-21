# Velvet Vendetta: Kentahten Rising

A top-down 2D browser campaign built with **Phaser 3, TypeScript, and Vite** under the Game Studio architecture.

## Current playable systems

- Clamped camera over a 40×40 Kentahten world matrix
- Bluegrass Estates, Lexington Transit, Coal-Hollows, river barriers, and bridge choke points
- Persistent character personalization and save state
- Keyboard and touch movement
- UV Vision and mission-only hidden assets
- Velvet Flow focus system
- Wanted level, reputation, faction standing, and Vendetta Memory
- Weapon draw/conceal, aiming, ammunition, reload, projectiles, NPC health, enemy fire, and player health
- Mission board, objective HUD, failure/retry screens, mission completion, campaign victory, replay, and unlock progression

## Five-mission campaign

1. **Bluegrass Surveillance** — locate three hidden ledger assets with UV Vision; any guard suspicion fails the operation.
2. **The Transit Ambush** — draw your weapon to force a Syndicate courier into an alley route and neutralize the target before bridge escape.
3. **Velvet Lockdown** — survive a five-star dragnet and reach the eastern safehouse using Velvet Flow.
4. **Hollows Retaliation** — defend the allied stronghold from ten projectile-firing retaliatory units.
5. **The Kentahten Sovereign** — pursue the regional overseer from the Estates Manor to the Coal-Hollow rail yards while the entire NPC memory grid is flagged.

## Controls

| Action | Keyboard | Touch |
|---|---|---|
| Move | WASD / Arrow keys | Direction pad |
| UV Vision | Hold Space | Hold UV |
| Velvet Flow | Hold Shift | Hold FLOW |
| Draw / conceal weapon | Q | ARM |
| Fire | F / Left click | FIRE |
| Reload | R | LOAD |
| Interact | E / Enter | ACT |
| Pause | Escape | Pause |

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

## Architecture

Gameplay and persistent rules are kept outside Phaser rendering:

- `MissionManager` owns mission initialization, objectives, success, failure, and campaign progression.
- `GameStore` owns serializable profile, combat, economy, mission, faction, wanted, and memory state.
- `NpcSystem`, `CombatSystem`, and `EnemyCombatSystem` own deterministic simulation logic.
- `GameScene` adapts simulation state into Phaser rendering, camera, input, and effects.
- `AppUi` provides DOM-based HUD, menus, touch controls, accessibility surfaces, and outcome screens.

## Verification

- `npm test`: **8 passing tests** covering store persistence, combat, mission failure, mission completion, and final campaign resolution.
- `npm run build`: production TypeScript and Vite build passes.
- Visual screenshot QA remains pending because the container's headless Chromium process cannot complete a Phaser capture session.
