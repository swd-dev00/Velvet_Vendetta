import type { CharacterBodyPreset, CharacterProfile } from '../types';
import { DEFAULT_OUTFIT_ID, WARDROBE_OUTFITS, getWardrobeOutfit } from '../data/wardrobe';

const baseProfile: Omit<CharacterProfile, 'bodyPreset' | 'pronouns' | 'hair'> = {
  name: 'Player',
  background: 'Clean Slate',
  archetype: 'Custom',
  complexion: 'Medium',
  makeup: 'None',
  scar: 'None',
  cybernetics: 'None',
  outfit: DEFAULT_OUTFIT_ID,
  accent: 'Kentucky',
  accessory: 'None'
};

export const DEFAULT_CHARACTER_PRESETS: Readonly<Record<CharacterBodyPreset, CharacterProfile>> = {
  female: {
    ...baseProfile,
    bodyPreset: 'female',
    pronouns: 'she/her',
    hair: 'Shoulder-length curls'
  },
  male: {
    ...baseProfile,
    bodyPreset: 'male',
    pronouns: 'he/him',
    hair: 'Short taper'
  }
};

export function createDefaultCharacter(bodyPreset: CharacterBodyPreset): CharacterProfile {
  return { ...DEFAULT_CHARACTER_PRESETS[bodyPreset] };
}

export function normalizeCharacterProfile(profile: CharacterProfile): CharacterProfile {
  const inferredBodyPreset: CharacterBodyPreset =
    profile.bodyPreset ?? (profile.pronouns.trim().toLowerCase() === 'he/him' ? 'male' : 'female');

  const outfit = getWardrobeOutfit(profile.outfit) ? profile.outfit : DEFAULT_OUTFIT_ID;

  return {
    ...profile,
    bodyPreset: inferredBodyPreset,
    outfit
  };
}

export function equipOutfit(profile: CharacterProfile, outfitId: string): CharacterProfile {
  if (!getWardrobeOutfit(outfitId)) {
    throw new Error(`Unknown wardrobe outfit: ${outfitId}`);
  }

  return {
    ...profile,
    outfit: outfitId
  };
}

export function getAvailableOutfits() {
  return WARDROBE_OUTFITS;
}

export function getEquippedVisual(profile: CharacterProfile) {
  const normalized = normalizeCharacterProfile(profile);
  const outfit = getWardrobeOutfit(normalized.outfit);

  if (!outfit) {
    throw new Error('Default wardrobe outfit is not configured.');
  }

  return normalized.bodyPreset === 'male' ? outfit.male : outfit.female;
}
