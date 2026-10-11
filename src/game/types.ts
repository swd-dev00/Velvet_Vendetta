export type Region = 'estates' | 'city' | 'hollows' | 'river';
export type Faction = 'Estates Oligarchy' | 'Syndicate Enforcers' | 'Hollows Resistance';
export type NpcState = 'routine' | 'suspicious' | 'hostile' | 'searching' | 'downed';
export type NpcRole = 'guard' | 'courier' | 'dragnet' | 'retaliator' | 'overseer';
export type MissionStatus = 'locked' | 'available' | 'active' | 'failed' | 'completed';
export type MissionRunStatus = 'active' | 'failed' | 'completed' | 'campaign-complete';
export type CharacterBodyPreset = 'female' | 'male';

export interface CharacterProfile {
  name: string;
  bodyPreset?: CharacterBodyPreset;
  pronouns: string;
  background: string;
  archetype: string;
  complexion: string;
  hair: string;
  makeup: string;
  scar: string;
  cybernetics: string;
  outfit: string;
  accent: string;
  accessory: string;
}

export interface ObjectiveDefinition {
  id: string;
  label: string;
  optional?: boolean;
  target: number;
}

export interface MissionDefinition {
  id: string;
  number: number;
  title: string;
  district: Region | 'all';
  briefing: string;
  mechanic: string;
  failureCondition: string;
  objectives: ObjectiveDefinition[];
  unlockAfter?: string;
}

export interface ObjectiveProgress extends ObjectiveDefinition {
  current: number;
  complete: boolean;
}

export interface MissionProgress {
  missionId: string;
  status: MissionStatus;
  objectives: ObjectiveProgress[];
}

export interface NpcMemory {
  encountered: boolean;
  recognizedOutfit?: string;
  lastKnownX?: number;
  lastKnownY?: number;
  exposureCount: number;
}

export interface NpcModel {
  id: string;
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  escapeX?: number;
  escapeY?: number;
  waypoints?: Array<{ x: number; y: number }>;
  waypointIndex?: number;
  faction: Faction;
  state: NpcState;
  role: NpcRole;
  speed: number;
  radius: number;
  health: number;
  maxHealth: number;
  memory: NpcMemory;
  suspicion: number;
  shotCooldown: number;
}

export interface ProjectileModel {
  id: string;
  owner: 'player' | 'enemy';
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  damage: number;
  ttl: number;
}

export interface CombatState {
  health: number;
  maxHealth: number;
  focus: number;
  maxFocus: number;
  equippedWeapon: string;
  isArmed: boolean;
  magazine: number;
  magazineCapacity: number;
  reserveAmmo: number;
}

export interface SaveState {
  version: number;
  profile: CharacterProfile;
  reputation: number;
  wantedLevel: number;
  currency: number;
  inventory: string[];
  factionStanding: Record<Faction, number>;
  missionProgress: MissionProgress[];
  npcMemory: Record<string, NpcMemory>;
  playerPosition: { x: number; y: number };
  activeMissionId: string;
  collectedIntel: string[];
  combat: CombatState;
  campaignComplete: boolean;
}

export interface MissionRuntimeState {
  missionId: string;
  status: MissionRunStatus;
  elapsedSeconds: number;
  failureReason?: string;
}

export interface MissionMarker {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: number;
  label: string;
  uvOnly?: boolean;
}
