import type { Strategy } from './types';
import { futureTechStrategy } from './future-tech';
import { traditionalStrategy } from './traditional';
import { commoditiesStrategy } from './commodities';
import { cryptoStrategy } from './crypto';

export const strategies: Record<string, Strategy> = {
  [futureTechStrategy.slug]: futureTechStrategy,
  [traditionalStrategy.slug]: traditionalStrategy,
  [commoditiesStrategy.slug]: commoditiesStrategy,
  [cryptoStrategy.slug]: cryptoStrategy,
};

export function getStrategyConfig(slug: string): Strategy | undefined {
  return strategies[slug];
}

export function getAllStrategies(): Strategy[] {
  return Object.values(strategies);
}

export type { Strategy, Allocation, AllocationProfile, RiskLevel, AssetClass } from './types';
