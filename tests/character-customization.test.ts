import { describe, expect, it } from 'vitest';
import { WARDROBE_OUTFITS } from '../src/game/data/wardrobe';
import {
  createDefaultCharacter,
  equipOutfit,
  getEquippedVisual,
  normalizeCharacterProfile
} from '../src/game/systems/CharacterCustomization';

describe('character customization', () => {
  it('ships exactly ten default outfit combinations', () => {
    expect(WARDROBE_OUTFITS).toHaveLength(10);
    expect(new Set(WARDROBE_OUTFITS.map((outfit) => outfit.id)).size).toBe(10);
  });

  it('provides both female and male default characters', () => {
    expect(createDefaultCharacter('female').bodyPreset).toBe('female');
    expect(createDefaultCharacter('male').bodyPreset).toBe('male');
  });

  it('equips a wardrobe preset without replacing the rest of the profile', () => {
    const player = createDefaultCharacter('male');
    const changed = equipOutfit(player, 'executive-velvet');

    expect(changed.name).toBe(player.name);
    expect(changed.bodyPreset).toBe('male');
    expect(changed.outfit).toBe('executive-velvet');
  });

  it('selects the visual variant for the chosen body preset', () => {
    const male = equipOutfit(createDefaultCharacter('male'), 'street-racer');
    const female = equipOutfit(createDefaultCharacter('female'), 'street-racer');

    expect(getEquippedVisual(male).assetKey).toBe('outfit-street-racer-m');
    expect(getEquippedVisual(female).assetKey).toBe('outfit-street-racer-f');
  });

  it('normalizes an older profile that has no bodyPreset', () => {
    const legacy = createDefaultCharacter('male');
    delete legacy.bodyPreset;

    const normalized = normalizeCharacterProfile(legacy);

    expect(normalized.bodyPreset).toBe('male');
  });
});
