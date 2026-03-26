import type { AllocationProfile } from './types';

// Conservative: favors stability — Traditional Industries and Commodities
const conservative: AllocationProfile = {
  slug: 'conservative',
  nameKey: 'profiles.conservative.name',
  weights: {
    'traditional':  0.40,
    'commodities':  0.30,
    'future-tech':  0.20,
    'crypto':       0.10,
  },
};

// Balanced: roughly even with a mild growth tilt
const balanced: AllocationProfile = {
  slug: 'balanced',
  nameKey: 'profiles.balanced.name',
  weights: {
    'future-tech':  0.30,
    'traditional':  0.25,
    'commodities':  0.25,
    'crypto':       0.20,
  },
};

// Aggressive: heavy on high-growth / high-risk funds
const aggressive: AllocationProfile = {
  slug: 'aggressive',
  nameKey: 'profiles.aggressive.name',
  weights: {
    'future-tech':  0.35,
    'crypto':       0.35,
    'commodities':  0.15,
    'traditional':  0.15,
  },
};

export const profiles: Record<string, AllocationProfile> = {
  [conservative.slug]: conservative,
  [balanced.slug]: balanced,
  [aggressive.slug]: aggressive,
};

export function getProfile(slug: string): AllocationProfile | undefined {
  return profiles[slug];
}

export function getAllProfiles(): AllocationProfile[] {
  return Object.values(profiles);
}
