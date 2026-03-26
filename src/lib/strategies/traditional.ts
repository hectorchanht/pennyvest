import type { Strategy } from './types';

export const traditionalStrategy: Strategy = {
  slug: 'traditional',
  riskLevel: 'low',
  nameKey: 'strategies.traditional.name',
  rationaleKey: 'strategies.traditional.rationale',
  allocations: [
    { ticker: 'JNJ', name: 'Johnson & Johnson',          weight: 0.20, assetClass: 'equity' },
    { ticker: 'KO',  name: 'The Coca-Cola Company',      weight: 0.20, assetClass: 'equity' },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.',       weight: 0.20, assetClass: 'equity' },
    { ticker: 'PG',  name: 'Procter & Gamble Co.',       weight: 0.15, assetClass: 'equity' },
    { ticker: 'VNQ', name: 'Vanguard Real Estate ETF',   weight: 0.15, assetClass: 'etf'    },
    { ticker: 'O',   name: 'Realty Income Corporation',  weight: 0.10, assetClass: 'equity' },
  ],
};
