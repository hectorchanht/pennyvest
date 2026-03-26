export interface RawNewsItem {
  uuid: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string; // ISO date string
}

export interface NewsAnalysis {
  summary: string; // 2-3 sentence extractive summary
  impact: 'bullish' | 'neutral' | 'bearish';
  reasoning: string; // 1-2 sentence explanation
}

export interface NewsItem extends RawNewsItem {
  analysis: NewsAnalysis | null; // null if AI analysis unavailable
}

export interface NewsResponse {
  articles: NewsItem[];
  cachedAt: number;
}
