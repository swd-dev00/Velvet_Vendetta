import { GameStore } from './systems/GameStore';
import { InputActions } from './systems/InputActions';
import { SaveService } from './systems/SaveService';
import { WorldModel } from './systems/WorldModel';

const loaded = SaveService.load();
export const store = new GameStore(loaded ?? undefined);
export const inputActions = new InputActions();
export const worldModel = new WorldModel();

store.addEventListener('change', () => SaveService.save(store.snapshot));
