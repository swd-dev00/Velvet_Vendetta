export interface ActionState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
  scan: boolean;
  flow: boolean;
  pause: boolean;
  toggleWeapon: boolean;
  fire: boolean;
  reload: boolean;
}

export class InputActions {
  readonly state: ActionState = {
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false,
    scan: false,
    flow: false,
    pause: false,
    toggleWeapon: false,
    fire: false,
    reload: false
  };

  set(action: keyof ActionState, active: boolean): void {
    this.state[action] = active;
  }

  consume(action: 'interact' | 'pause' | 'toggleWeapon' | 'fire' | 'reload'): boolean {
    const active = this.state[action];
    this.state[action] = false;
    return active;
  }
}
