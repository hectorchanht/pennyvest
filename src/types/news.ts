export type NewsImpact = 'bullish' | 'neutral' | 'bearish';

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  imageUrl: string | null;
  category: string;
  publishedAt: string; // ISO date string
  relatedTickers: string[];
  /** AI impact assessment — populated by /api/news/[slug]/impact, absent when unavailable */
  impact?: NewsImpact | null;
  impactReasoning?: string | null;
}

export interface NewsResponse {
  articles: NewsArticle[];
  cachedAt: number;
}

export interface NewsImpactResponse {
  impacts: Record<string, { impact: NewsImpact; reasoning: string }>;
  cachedAt: number;
  unavailable?: boolean;
}
