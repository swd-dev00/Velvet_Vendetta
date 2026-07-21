import type { Region } from '../types';

export const TILE_SIZE = 64;
export const MAP_COLS = 40;
export const MAP_ROWS = 40;
export const WORLD_WIDTH = MAP_COLS * TILE_SIZE;
export const WORLD_HEIGHT = MAP_ROWS * TILE_SIZE;

export interface TileDefinition {
  region: Region;
  color: number;
  passable: boolean;
  label: string;
}

export const TILE_DEFINITIONS: Record<number, TileDefinition> = {
  0: { region: 'river', color: 0x14161f, passable: false, label: 'Natural River Boundary' },
  1: { region: 'estates', color: 0x253b2a, passable: true, label: 'Bluegrass Horse Estates' },
  2: { region: 'city', color: 0x302d33, passable: true, label: 'Lexington Grid Transit' },
  3: { region: 'hollows', color: 0x40362e, passable: true, label: 'Forgotten Coal-Hollows' }
};

export interface SecretNode {
  id: string;
  col: number;
  row: number;
  label: string;
  collected: boolean;
  missionCritical?: boolean;
}

const MISSION_LEDGER_NODES: Array<[string, number, number]> = [
  ['bluegrass-ledger-1', 4, 8],
  ['bluegrass-ledger-2', 10, 18],
  ['bluegrass-ledger-3', 5, 31]
];

export class WorldModel {
  readonly map: number[][];
  readonly secrets: SecretNode[] = [];
  private readonly ambientSecrets: SecretNode[];

  constructor(seed = 417) {
    this.map = this.generateMap();
    this.ambientSecrets = this.generateAmbientSecrets(seed);
    this.configureMission('bluegrass-surveillance', []);
  }

  configureMission(missionId: string, collectedIntel: string[]): void {
    this.secrets.length = 0;
    for (const secret of this.ambientSecrets) {
      this.secrets.push({ ...secret, collected: collectedIntel.includes(secret.id) });
    }
    if (missionId === 'bluegrass-surveillance') {
      for (const [id, col, row] of MISSION_LEDGER_NODES) {
        this.secrets.push({
          id,
          col,
          row,
          label: 'Hidden Ledger Asset',
          collected: false,
          missionCritical: true
        });
      }
    }
  }

  private generateMap(): number[][] {
    const map = Array.from({ length: MAP_ROWS }, () => Array<number>(MAP_COLS).fill(0));
    for (let row = 0; row < MAP_ROWS; row += 1) {
      for (let col = 0; col < MAP_COLS; col += 1) {
        if (row === 0 || col === 0 || row === MAP_ROWS - 1 || col === MAP_COLS - 1) {
          map[row][col] = 0;
        } else if (col < 14) {
          map[row][col] = 1;
        } else if (col < 26) {
          map[row][col] = 2;
        } else {
          map[row][col] = 3;
        }
      }
    }

    for (let row = 1; row < MAP_ROWS - 1; row += 1) {
      map[row][13] = row === 10 || row === 11 || row === 28 || row === 29 ? 2 : 0;
    }

    return map;
  }

  private generateAmbientSecrets(seed: number): SecretNode[] {
    let state = seed >>> 0;
    const random = (): number => {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / 0x100000000;
    };
    const labels = ['Intel Drop', 'Safehouse Asset', 'Underworld Link', 'Cache', 'Corrupt Ledger'];
    const secrets: SecretNode[] = [];
    for (let row = 2; row < MAP_ROWS - 2; row += 1) {
      for (let col = 2; col < MAP_COLS - 2; col += 1) {
        if (this.map[row][col] !== 0 && random() < 0.012) {
          secrets.push({
            id: `secret-${col}-${row}`,
            col,
            row,
            label: labels[Math.floor(random() * labels.length)],
            collected: false
          });
        }
      }
    }
    return secrets;
  }

  isPassableWorld(x: number, y: number, radius = 12): boolean {
    const points = [
      [x - radius, y - radius],
      [x + radius, y - radius],
      [x - radius, y + radius],
      [x + radius, y + radius]
    ];
    return points.every(([px, py]) => {
      const col = Math.floor(px / TILE_SIZE);
      const row = Math.floor(py / TILE_SIZE);
      if (row < 0 || col < 0 || row >= MAP_ROWS || col >= MAP_COLS) return false;
      return TILE_DEFINITIONS[this.map[row][col]].passable;
    });
  }

  getRegionAt(x: number, y: number): Region {
    const col = Math.max(0, Math.min(MAP_COLS - 1, Math.floor(x / TILE_SIZE)));
    const row = Math.max(0, Math.min(MAP_ROWS - 1, Math.floor(y / TILE_SIZE)));
    return TILE_DEFINITIONS[this.map[row][col]].region;
  }
}
