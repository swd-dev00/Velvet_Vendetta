export type WardrobeSlot =
  | 'headwear'
  | 'outerwear'
  | 'top'
  | 'bottom'
  | 'footwear'
  | 'accessory';

export interface OutfitVisualVariant {
  assetKey: string;
  pieces: Partial<Record<WardrobeSlot, string>>;
}

export interface WardrobeOutfit {
  id: string;
  name: string;
  description: string;
  tags: string[];
  female: OutfitVisualVariant;
  male: OutfitVisualVariant;
}

export const DEFAULT_OUTFIT_ID = 'bluegrass-casual';

export const WARDROBE_OUTFITS: readonly WardrobeOutfit[] = [
  {
    id: 'bluegrass-casual',
    name: 'Bluegrass Casual',
    description: 'Clean everyday Kentucky streetwear for free roam and early missions.',
    tags: ['casual', 'starter', 'neutral'],
    female: {
      assetKey: 'outfit-bluegrass-casual-f',
      pieces: { top: 'fitted-tee', bottom: 'dark-denim', footwear: 'clean-sneakers', accessory: 'minimal-chain' }
    },
    male: {
      assetKey: 'outfit-bluegrass-casual-m',
      pieces: { top: 'crew-tee', bottom: 'dark-denim', footwear: 'clean-sneakers', accessory: 'watch' }
    }
  },
  {
    id: 'lexington-night',
    name: 'Lexington Night',
    description: 'Polished nightlife styling for clubs, lounges, and downtown contacts.',
    tags: ['nightlife', 'social'],
    female: {
      assetKey: 'outfit-lexington-night-f',
      pieces: { outerwear: 'cropped-jacket', top: 'sleek-top', bottom: 'tailored-pants', footwear: 'ankle-boots', accessory: 'statement-earrings' }
    },
    male: {
      assetKey: 'outfit-lexington-night-m',
      pieces: { outerwear: 'bomber-jacket', top: 'dark-knit', bottom: 'tailored-pants', footwear: 'leather-sneakers', accessory: 'chain' }
    }
  },
  {
    id: 'derby-day',
    name: 'Derby Day',
    description: 'Upscale race-day attire suitable for elite social spaces.',
    tags: ['formal', 'social', 'derby'],
    female: {
      assetKey: 'outfit-derby-day-f',
      pieces: { headwear: 'derby-hat', top: 'structured-dress', footwear: 'dress-heels', accessory: 'clutch' }
    },
    male: {
      assetKey: 'outfit-derby-day-m',
      pieces: { headwear: 'fedora', outerwear: 'light-blazer', top: 'dress-shirt', bottom: 'dress-trousers', footwear: 'loafers', accessory: 'pocket-square' }
    }
  },
  {
    id: 'bourbon-run',
    name: 'Bourbon Run',
    description: 'Rugged roadwear built for distillery routes, backroads, and rough jobs.',
    tags: ['rugged', 'rural'],
    female: {
      assetKey: 'outfit-bourbon-run-f',
      pieces: { outerwear: 'waxed-jacket', top: 'henley', bottom: 'work-jeans', footwear: 'work-boots', accessory: 'leather-belt' }
    },
    male: {
      assetKey: 'outfit-bourbon-run-m',
      pieces: { outerwear: 'waxed-jacket', top: 'henley', bottom: 'work-jeans', footwear: 'work-boots', accessory: 'leather-belt' }
    }
  },
  {
    id: 'hollows-utility',
    name: 'Hollows Utility',
    description: 'Durable field clothing for hills, trails, industrial sites, and bad weather.',
    tags: ['utility', 'rural', 'outdoor'],
    female: {
      assetKey: 'outfit-hollows-utility-f',
      pieces: { outerwear: 'utility-shell', top: 'thermal-layer', bottom: 'cargo-pants', footwear: 'trail-boots', accessory: 'field-pack' }
    },
    male: {
      assetKey: 'outfit-hollows-utility-m',
      pieces: { outerwear: 'utility-shell', top: 'thermal-layer', bottom: 'cargo-pants', footwear: 'trail-boots', accessory: 'field-pack' }
    }
  },
  {
    id: 'street-racer',
    name: 'Street Racer',
    description: 'Performance streetwear tied to the underground racing scene.',
    tags: ['racing', 'street'],
    female: {
      assetKey: 'outfit-street-racer-f',
      pieces: { outerwear: 'racing-jacket', top: 'performance-top', bottom: 'black-denim', footwear: 'driving-sneakers', accessory: 'driving-gloves' }
    },
    male: {
      assetKey: 'outfit-street-racer-m',
      pieces: { outerwear: 'racing-jacket', top: 'performance-tee', bottom: 'black-denim', footwear: 'driving-sneakers', accessory: 'driving-gloves' }
    }
  },
  {
    id: 'executive-velvet',
    name: 'Executive Velvet',
    description: 'High-status business wear for boardrooms, donors, and power players.',
    tags: ['formal', 'business', 'velvet'],
    female: {
      assetKey: 'outfit-executive-velvet-f',
      pieces: { outerwear: 'velvet-blazer', top: 'silk-shell', bottom: 'tailored-trousers', footwear: 'dress-boots', accessory: 'gold-watch' }
    },
    male: {
      assetKey: 'outfit-executive-velvet-m',
      pieces: { outerwear: 'velvet-suit-jacket', top: 'dress-shirt', bottom: 'tailored-trousers', footwear: 'oxfords', accessory: 'gold-watch' }
    }
  },
  {
    id: 'blue-collar',
    name: 'Blue Collar',
    description: 'Practical workwear for garages, construction sites, and industrial access.',
    tags: ['workwear', 'industrial'],
    female: {
      assetKey: 'outfit-blue-collar-f',
      pieces: { outerwear: 'work-jacket', top: 'shop-shirt', bottom: 'utility-jeans', footwear: 'steel-toe-boots', accessory: 'work-gloves' }
    },
    male: {
      assetKey: 'outfit-blue-collar-m',
      pieces: { outerwear: 'work-jacket', top: 'shop-shirt', bottom: 'utility-jeans', footwear: 'steel-toe-boots', accessory: 'work-gloves' }
    }
  },
  {
    id: 'low-profile',
    name: 'Low Profile',
    description: 'Muted, practical clothing for surveillance, stealth, and anonymous movement.',
    tags: ['stealth', 'tactical'],
    female: {
      assetKey: 'outfit-low-profile-f',
      pieces: { headwear: 'plain-cap', outerwear: 'dark-hooded-jacket', top: 'base-layer', bottom: 'utility-pants', footwear: 'quiet-trainers', accessory: 'crossbody-bag' }
    },
    male: {
      assetKey: 'outfit-low-profile-m',
      pieces: { headwear: 'plain-cap', outerwear: 'dark-hooded-jacket', top: 'base-layer', bottom: 'utility-pants', footwear: 'quiet-trainers', accessory: 'crossbody-bag' }
    }
  },
  {
    id: 'sunday-best',
    name: 'Sunday Best',
    description: 'Refined formalwear for church, family events, charity functions, and respectable fronts.',
    tags: ['formal', 'social', 'respectable'],
    female: {
      assetKey: 'outfit-sunday-best-f',
      pieces: { outerwear: 'long-coat', top: 'formal-dress', footwear: 'dress-shoes', accessory: 'structured-handbag' }
    },
    male: {
      assetKey: 'outfit-sunday-best-m',
      pieces: { outerwear: 'tailored-coat', top: 'button-down', bottom: 'pressed-trousers', footwear: 'dress-shoes', accessory: 'dress-watch' }
    }
  }
];

export function getWardrobeOutfit(id: string): WardrobeOutfit | undefined {
  return WARDROBE_OUTFITS.find((outfit) => outfit.id === id);
}
