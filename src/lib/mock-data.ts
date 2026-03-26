export interface MockNewsItem {
  id: string;
  headlineKey: string;      // i18n key for headline
  category: 'geopolitics' | 'ai' | 'semiconductor' | 'commodities' | 'crypto' | 'macro';
  source: string;           // e.g. "Reuters", "Bloomberg"
  date: string;             // e.g. "2026-03-27"
  impactScore: number;      // 1-10
  summaryKey: string;       // i18n key
  shortTermImpactKey: string; // i18n key
  midTermImpactKey: string;   // i18n key
  relatedHoldings: string[];  // ticker symbols, e.g. ["NVDA", "TSM", "AMD"]
  relatedStrategies: string[]; // strategy slugs, e.g. ["future-tech"]
}

export interface MockStrategyData {
  slug: string;
  dailyChangePct: number;  // e.g. 2.25 for +2.25%, -1.5 for -1.5%
  topHoldings: Array<{ ticker: string; weight: number }>; // top 3
}

// Extended mock data for fund detail page
export interface MockHoldingDetail {
  ticker: string;
  dailyChangePct: number;  // e.g. 1.85 for +1.85%
}

export interface MockFundDetail {
  slug: string;
  portfolioValue: number;          // always 1_000_000 (simulated $1M)
  dailyGainPct: number;            // e.g. 2.25
  cashRatio: number;               // e.g. 2.0 (percent)
  sixMonthTargetPct: number;       // e.g. 15
  annualizedReturnPct: number;     // e.g. 28
  holdingDetails: MockHoldingDetail[]; // daily change per ticker
}

export interface MockOpportunityAction {
  ticker: string;
  action: 'hold' | 'add' | 'reduce';
}

export interface MockOpportunity {
  id: string;
  titleKey: string;
  descriptionKey: string;
  confidence: number;    // 1-10
  horizonKey: string;
  logicKey: string;
  catalystKeys: string[];
  riskKeys: string[];
  actions: MockOpportunityAction[];
}

export interface MockHoldingAdjustment {
  ticker: string;
  action: 'hold' | 'add' | 'reduce';
  reasoningKey: string;
}

export interface MockPortfolioNotes {
  slug: string;
  actionSummaryKey: string;
  descriptionKey: string;
  holdingAdjustments: MockHoldingAdjustment[];
  riskNoteKey: string;
  cashNoteKey: string;
}

export const mockNewsItems: MockNewsItem[] = [
  {
    id: 'news-1',
    headlineKey: 'newsDigest.news1.headline',
    category: 'ai',
    source: 'Reuters',
    date: '2026-03-27',
    impactScore: 9,
    summaryKey: 'newsDigest.news1.summary',
    shortTermImpactKey: 'newsDigest.news1.shortTermImpact',
    midTermImpactKey: 'newsDigest.news1.midTermImpact',
    relatedHoldings: ['NVDA', 'AMD', 'PLTR'],
    relatedStrategies: ['future-tech'],
  },
  {
    id: 'news-2',
    headlineKey: 'newsDigest.news2.headline',
    category: 'geopolitics',
    source: 'Bloomberg',
    date: '2026-03-26',
    impactScore: 8,
    summaryKey: 'newsDigest.news2.summary',
    shortTermImpactKey: 'newsDigest.news2.shortTermImpact',
    midTermImpactKey: 'newsDigest.news2.midTermImpact',
    relatedHoldings: ['GLD', 'SLV', 'USO'],
    relatedStrategies: ['commodities'],
  },
  {
    id: 'news-3',
    headlineKey: 'newsDigest.news3.headline',
    category: 'macro',
    source: 'Financial Times',
    date: '2026-03-26',
    impactScore: 7,
    summaryKey: 'newsDigest.news3.summary',
    shortTermImpactKey: 'newsDigest.news3.shortTermImpact',
    midTermImpactKey: 'newsDigest.news3.midTermImpact',
    relatedHoldings: ['JNJ', 'PG', 'KO'],
    relatedStrategies: ['traditional'],
  },
  {
    id: 'news-4',
    headlineKey: 'newsDigest.news4.headline',
    category: 'crypto',
    source: 'CoinDesk',
    date: '2026-03-25',
    impactScore: 6,
    summaryKey: 'newsDigest.news4.summary',
    shortTermImpactKey: 'newsDigest.news4.shortTermImpact',
    midTermImpactKey: 'newsDigest.news4.midTermImpact',
    relatedHoldings: ['bitcoin', 'ethereum'],
    relatedStrategies: ['crypto'],
  },
];

export const mockStrategyData: Record<string, MockStrategyData> = {
  'future-tech': {
    slug: 'future-tech',
    dailyChangePct: 2.25,
    topHoldings: [
      { ticker: 'NVDA', weight: 0.25 },
      { ticker: 'TSLA', weight: 0.20 },
      { ticker: 'ARKK', weight: 0.20 },
    ],
  },
  'traditional': {
    slug: 'traditional',
    dailyChangePct: 0.45,
    topHoldings: [
      { ticker: 'JNJ', weight: 0.20 },
      { ticker: 'PG', weight: 0.20 },
      { ticker: 'KO', weight: 0.15 },
    ],
  },
  'commodities': {
    slug: 'commodities',
    dailyChangePct: -0.80,
    topHoldings: [
      { ticker: 'GLD', weight: 0.30 },
      { ticker: 'USO', weight: 0.20 },
      { ticker: 'SLV', weight: 0.15 },
    ],
  },
  'crypto': {
    slug: 'crypto',
    dailyChangePct: 4.10,
    topHoldings: [
      { ticker: 'BTC', weight: 0.40 },
      { ticker: 'ETH', weight: 0.30 },
      { ticker: 'SOL', weight: 0.15 },
    ],
  },
};

export const mockFundDetails: Record<string, MockFundDetail> = {
  'future-tech': {
    slug: 'future-tech',
    portfolioValue: 1_000_000,
    dailyGainPct: 2.25,
    cashRatio: 2.0,
    sixMonthTargetPct: 15,
    annualizedReturnPct: 28,
    holdingDetails: [
      { ticker: 'NVDA', dailyChangePct: 3.10 },
      { ticker: 'TSLA', dailyChangePct: 1.85 },
      { ticker: 'ARKK', dailyChangePct: 2.05 },
      { ticker: 'AMD',  dailyChangePct: 1.40 },
      { ticker: 'PLTR', dailyChangePct: 4.20 },
      { ticker: 'MSTR', dailyChangePct: -0.75 },
    ],
  },
  'traditional': {
    slug: 'traditional',
    portfolioValue: 1_000_000,
    dailyGainPct: 0.45,
    cashRatio: 3.0,
    sixMonthTargetPct: 6,
    annualizedReturnPct: 9,
    holdingDetails: [
      { ticker: 'JNJ', dailyChangePct: 0.60 },
      { ticker: 'KO',  dailyChangePct: 0.30 },
      { ticker: 'JPM', dailyChangePct: 0.80 },
      { ticker: 'PG',  dailyChangePct: 0.20 },
      { ticker: 'VNQ', dailyChangePct: 0.45 },
      { ticker: 'O',   dailyChangePct: -0.10 },
    ],
  },
  'commodities': {
    slug: 'commodities',
    portfolioValue: 1_000_000,
    dailyGainPct: -0.80,
    cashRatio: 5.0,
    sixMonthTargetPct: 8,
    annualizedReturnPct: 12,
    holdingDetails: [
      { ticker: 'GLD',  dailyChangePct: -0.50 },
      { ticker: 'USO',  dailyChangePct: -1.80 },
      { ticker: 'DBA',  dailyChangePct: 0.30 },
      { ticker: 'BHP',  dailyChangePct: -1.20 },
      { ticker: 'NEM',  dailyChangePct: -0.40 },
      { ticker: 'WEAT', dailyChangePct: 0.90 },
    ],
  },
  'crypto': {
    slug: 'crypto',
    portfolioValue: 1_000_000,
    dailyGainPct: 4.10,
    cashRatio: 1.0,
    sixMonthTargetPct: 40,
    annualizedReturnPct: 85,
    holdingDetails: [
      { ticker: 'bitcoin',     dailyChangePct: 4.50 },
      { ticker: 'ethereum',    dailyChangePct: 3.80 },
      { ticker: 'solana',      dailyChangePct: 5.20 },
      { ticker: 'chainlink',   dailyChangePct: 2.90 },
      { ticker: 'avalanche-2', dailyChangePct: 6.10 },
      { ticker: 'polkadot',    dailyChangePct: 1.60 },
    ],
  },
};

export const mockOpportunities: Record<string, MockOpportunity[]> = {
  'future-tech': [
    {
      id: 'ft-opp-1',
      titleKey: 'fundDetail.futureTech.opportunity1.title',
      descriptionKey: 'fundDetail.futureTech.opportunity1.description',
      confidence: 8,
      horizonKey: 'fundDetail.futureTech.opportunity1.horizon',
      logicKey: 'fundDetail.futureTech.opportunity1.logic',
      catalystKeys: [
        'fundDetail.futureTech.opportunity1.catalyst1',
        'fundDetail.futureTech.opportunity1.catalyst2',
        'fundDetail.futureTech.opportunity1.catalyst3',
      ],
      riskKeys: [
        'fundDetail.futureTech.opportunity1.risk1',
        'fundDetail.futureTech.opportunity1.risk2',
      ],
      actions: [
        { ticker: 'NVDA', action: 'add' },
        { ticker: 'PLTR', action: 'hold' },
      ],
    },
    {
      id: 'ft-opp-2',
      titleKey: 'fundDetail.futureTech.opportunity2.title',
      descriptionKey: 'fundDetail.futureTech.opportunity2.description',
      confidence: 7,
      horizonKey: 'fundDetail.futureTech.opportunity2.horizon',
      logicKey: 'fundDetail.futureTech.opportunity2.logic',
      catalystKeys: [
        'fundDetail.futureTech.opportunity2.catalyst1',
        'fundDetail.futureTech.opportunity2.catalyst2',
      ],
      riskKeys: [
        'fundDetail.futureTech.opportunity2.risk1',
        'fundDetail.futureTech.opportunity2.risk2',
      ],
      actions: [
        { ticker: 'TSLA', action: 'hold' },
        { ticker: 'ARKK', action: 'reduce' },
      ],
    },
  ],
  'traditional': [
    {
      id: 'trad-opp-1',
      titleKey: 'fundDetail.traditional.opportunity1.title',
      descriptionKey: 'fundDetail.traditional.opportunity1.description',
      confidence: 7,
      horizonKey: 'fundDetail.traditional.opportunity1.horizon',
      logicKey: 'fundDetail.traditional.opportunity1.logic',
      catalystKeys: [
        'fundDetail.traditional.opportunity1.catalyst1',
        'fundDetail.traditional.opportunity1.catalyst2',
      ],
      riskKeys: [
        'fundDetail.traditional.opportunity1.risk1',
      ],
      actions: [
        { ticker: 'JPM', action: 'add' },
        { ticker: 'KO', action: 'hold' },
      ],
    },
    {
      id: 'trad-opp-2',
      titleKey: 'fundDetail.traditional.opportunity2.title',
      descriptionKey: 'fundDetail.traditional.opportunity2.description',
      confidence: 6,
      horizonKey: 'fundDetail.traditional.opportunity2.horizon',
      logicKey: 'fundDetail.traditional.opportunity2.logic',
      catalystKeys: [
        'fundDetail.traditional.opportunity2.catalyst1',
        'fundDetail.traditional.opportunity2.catalyst2',
      ],
      riskKeys: [
        'fundDetail.traditional.opportunity2.risk1',
      ],
      actions: [
        { ticker: 'VNQ', action: 'hold' },
        { ticker: 'O', action: 'add' },
      ],
    },
  ],
  'commodities': [
    {
      id: 'comm-opp-1',
      titleKey: 'fundDetail.commodities.opportunity1.title',
      descriptionKey: 'fundDetail.commodities.opportunity1.description',
      confidence: 7,
      horizonKey: 'fundDetail.commodities.opportunity1.horizon',
      logicKey: 'fundDetail.commodities.opportunity1.logic',
      catalystKeys: [
        'fundDetail.commodities.opportunity1.catalyst1',
        'fundDetail.commodities.opportunity1.catalyst2',
      ],
      riskKeys: [
        'fundDetail.commodities.opportunity1.risk1',
        'fundDetail.commodities.opportunity1.risk2',
      ],
      actions: [
        { ticker: 'GLD', action: 'add' },
        { ticker: 'USO', action: 'reduce' },
      ],
    },
    {
      id: 'comm-opp-2',
      titleKey: 'fundDetail.commodities.opportunity2.title',
      descriptionKey: 'fundDetail.commodities.opportunity2.description',
      confidence: 6,
      horizonKey: 'fundDetail.commodities.opportunity2.horizon',
      logicKey: 'fundDetail.commodities.opportunity2.logic',
      catalystKeys: [
        'fundDetail.commodities.opportunity2.catalyst1',
      ],
      riskKeys: [
        'fundDetail.commodities.opportunity2.risk1',
      ],
      actions: [
        { ticker: 'DBA', action: 'hold' },
        { ticker: 'NEM', action: 'add' },
      ],
    },
  ],
  'crypto': [
    {
      id: 'crypto-opp-1',
      titleKey: 'fundDetail.crypto.opportunity1.title',
      descriptionKey: 'fundDetail.crypto.opportunity1.description',
      confidence: 8,
      horizonKey: 'fundDetail.crypto.opportunity1.horizon',
      logicKey: 'fundDetail.crypto.opportunity1.logic',
      catalystKeys: [
        'fundDetail.crypto.opportunity1.catalyst1',
        'fundDetail.crypto.opportunity1.catalyst2',
        'fundDetail.crypto.opportunity1.catalyst3',
      ],
      riskKeys: [
        'fundDetail.crypto.opportunity1.risk1',
        'fundDetail.crypto.opportunity1.risk2',
      ],
      actions: [
        { ticker: 'bitcoin', action: 'hold' },
        { ticker: 'ethereum', action: 'add' },
      ],
    },
    {
      id: 'crypto-opp-2',
      titleKey: 'fundDetail.crypto.opportunity2.title',
      descriptionKey: 'fundDetail.crypto.opportunity2.description',
      confidence: 7,
      horizonKey: 'fundDetail.crypto.opportunity2.horizon',
      logicKey: 'fundDetail.crypto.opportunity2.logic',
      catalystKeys: [
        'fundDetail.crypto.opportunity2.catalyst1',
        'fundDetail.crypto.opportunity2.catalyst2',
      ],
      riskKeys: [
        'fundDetail.crypto.opportunity2.risk1',
      ],
      actions: [
        { ticker: 'solana', action: 'add' },
        { ticker: 'polkadot', action: 'reduce' },
      ],
    },
  ],
};

export const mockPortfolioNotes: Record<string, MockPortfolioNotes> = {
  'future-tech': {
    slug: 'future-tech',
    actionSummaryKey: 'fundDetail.futureTech.notes.actionSummary',
    descriptionKey: 'fundDetail.futureTech.notes.description',
    holdingAdjustments: [
      { ticker: 'NVDA', action: 'add',    reasoningKey: 'fundDetail.futureTech.notes.nvdaReasoning' },
      { ticker: 'TSLA', action: 'hold',   reasoningKey: 'fundDetail.futureTech.notes.tslaReasoning' },
      { ticker: 'MSTR', action: 'reduce', reasoningKey: 'fundDetail.futureTech.notes.mstrReasoning' },
    ],
    riskNoteKey: 'fundDetail.futureTech.notes.riskNote',
    cashNoteKey: 'fundDetail.futureTech.notes.cashNote',
  },
  'traditional': {
    slug: 'traditional',
    actionSummaryKey: 'fundDetail.traditional.notes.actionSummary',
    descriptionKey: 'fundDetail.traditional.notes.description',
    holdingAdjustments: [
      { ticker: 'JPM', action: 'add',  reasoningKey: 'fundDetail.traditional.notes.jpmReasoning' },
      { ticker: 'JNJ', action: 'hold', reasoningKey: 'fundDetail.traditional.notes.jnjReasoning' },
      { ticker: 'VNQ', action: 'hold', reasoningKey: 'fundDetail.traditional.notes.vnqReasoning' },
    ],
    riskNoteKey: 'fundDetail.traditional.notes.riskNote',
    cashNoteKey: 'fundDetail.traditional.notes.cashNote',
  },
  'commodities': {
    slug: 'commodities',
    actionSummaryKey: 'fundDetail.commodities.notes.actionSummary',
    descriptionKey: 'fundDetail.commodities.notes.description',
    holdingAdjustments: [
      { ticker: 'GLD', action: 'add',    reasoningKey: 'fundDetail.commodities.notes.gldReasoning' },
      { ticker: 'USO', action: 'reduce', reasoningKey: 'fundDetail.commodities.notes.usoReasoning' },
      { ticker: 'DBA', action: 'hold',   reasoningKey: 'fundDetail.commodities.notes.dbaReasoning' },
    ],
    riskNoteKey: 'fundDetail.commodities.notes.riskNote',
    cashNoteKey: 'fundDetail.commodities.notes.cashNote',
  },
  'crypto': {
    slug: 'crypto',
    actionSummaryKey: 'fundDetail.crypto.notes.actionSummary',
    descriptionKey: 'fundDetail.crypto.notes.description',
    holdingAdjustments: [
      { ticker: 'bitcoin',  action: 'hold', reasoningKey: 'fundDetail.crypto.notes.bitcoinReasoning' },
      { ticker: 'ethereum', action: 'add',  reasoningKey: 'fundDetail.crypto.notes.ethereumReasoning' },
      { ticker: 'solana',   action: 'add',  reasoningKey: 'fundDetail.crypto.notes.solanaReasoning' },
    ],
    riskNoteKey: 'fundDetail.crypto.notes.riskNote',
    cashNoteKey: 'fundDetail.crypto.notes.cashNote',
  },
};
