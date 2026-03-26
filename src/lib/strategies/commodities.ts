import type { Strategy } from './types';

export const commoditiesStrategy: Strategy = {
  slug: 'commodities',
  riskLevel: 'medium',
  nameKey: 'strategies.commodities.name',
  rationaleKey: 'strategies.commodities.rationale',
  allocations: [
    { ticker: 'GLD',  name: 'SPDR Gold Shares ETF',          weight: 0.30, assetClass: 'etf'       },
    { ticker: 'USO',  name: 'United States Oil Fund ETF',     weight: 0.20, assetClass: 'etf'       },
    { ticker: 'DBA',  name: 'Invesco DB Agriculture ETF',     weight: 0.20, assetClass: 'etf'       },
    { ticker: 'BHP',  name: 'BHP Group Limited',             weight: 0.15, assetClass: 'equity'    },
    { ticker: 'NEM',  name: 'Newmont Corporation',           weight: 0.10, assetClass: 'equity'    },
    { ticker: 'WEAT', name: 'Teucrium Wheat Fund ETF',       weight: 0.05, assetClass: 'commodity' },
  ],
};
