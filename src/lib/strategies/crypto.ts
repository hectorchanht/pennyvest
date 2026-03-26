import type { Strategy } from './types';

export const cryptoStrategy: Strategy = {
  slug: 'crypto',
  riskLevel: 'high',
  nameKey: 'strategies.crypto.name',
  rationaleKey: 'strategies.crypto.rationale',
  allocations: [
    { ticker: 'bitcoin',   name: 'Bitcoin',   weight: 0.35, assetClass: 'crypto' },
    { ticker: 'ethereum',  name: 'Ethereum',  weight: 0.25, assetClass: 'crypto' },
    { ticker: 'solana',    name: 'Solana',    weight: 0.15, assetClass: 'crypto' },
    { ticker: 'chainlink', name: 'Chainlink', weight: 0.10, assetClass: 'crypto' },
    { ticker: 'avalanche-2', name: 'Avalanche', weight: 0.10, assetClass: 'crypto' },
    { ticker: 'polkadot',  name: 'Polkadot',  weight: 0.05, assetClass: 'crypto' },
  ],
};
