import type { Strategy } from './types';

export const futureTechStrategy: Strategy = {
  slug: 'future-tech',
  riskLevel: 'high',
  nameKey: 'strategies.futureTech.name',
  rationaleKey: 'strategies.futureTech.rationale',
  allocations: [
    { ticker: 'NVDA', name: 'NVIDIA Corporation',        weight: 0.25, assetClass: 'equity' },
    { ticker: 'TSLA', name: 'Tesla, Inc.',               weight: 0.20, assetClass: 'equity' },
    { ticker: 'ARKK', name: 'ARK Innovation ETF',        weight: 0.20, assetClass: 'etf'    },
    { ticker: 'AMD',  name: 'Advanced Micro Devices',    weight: 0.15, assetClass: 'equity' },
    { ticker: 'PLTR', name: 'Palantir Technologies',     weight: 0.10, assetClass: 'equity' },
    { ticker: 'MSTR', name: 'MicroStrategy Incorporated',weight: 0.10, assetClass: 'equity' },
  ],
};
