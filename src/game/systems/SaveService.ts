import type { SaveState } from '../types';

const SAVE_KEY = 'velvet-vendetta-save-v3';

export const SaveService = {
  save(state: SaveState): void {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  },
  load(): SaveState | null {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as SaveState;
      return parsed.version === 3 ? parsed : null;
    } catch {
      return null;
    }
  },
  clear(): void {
    localStorage.removeItem(SAVE_KEY);
  }
};
