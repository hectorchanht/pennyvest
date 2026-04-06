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
}

export interface NewsResponse {
  articles: NewsArticle[];
  cachedAt: number;
}
