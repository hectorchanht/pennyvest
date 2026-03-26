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
