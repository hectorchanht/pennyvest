export type RiskLevel = 'low' | 'medium' | 'high';

export type AssetClass = 'equity' | 'etf' | 'commodity' | 'crypto';

export interface Allocation {
  ticker: string;
  name: string;
  weight: number; // 0-1 decimal, all weights in a Strategy must sum to 1.0
  assetClass: AssetClass;
}

export interface Strategy {
  slug: string;
  riskLevel: RiskLevel;
  allocations: Allocation[];
  nameKey: string;     // i18n key, e.g. 'strategies.futureTech.name'
  rationaleKey: string; // i18n key, e.g. 'strategies.futureTech.rationale'
}

export interface AllocationProfile {
  slug: string;
  nameKey: string; // i18n key, e.g. 'profiles.conservative.name'
  weights: Record<string, number>; // fundSlug -> weight (0-1), must sum to 1.0
}
