import 'server-only';
import type { NewsArticle } from '@/types/news';

const BASE_URL = 'https://finnhub.io/api/v1';

interface FinnhubNewsItem {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  category: string;
  datetime: number; // unix timestamp
  related: string; // comma-separated tickers
}

function toNewsArticle(item: FinnhubNewsItem, tickers: string[] = []): NewsArticle {
  return {
    id: String(item.id),
    headline: item.headline,
    summary: item.summary || '',
    source: item.source,
    url: item.url,
    imageUrl: item.image || null,
    category: item.category || 'general',
    publishedAt: new Date(item.datetime * 1000).toISOString(),
    relatedTickers: item.related
      ? item.related.split(',').map((t) => t.trim()).filter(Boolean)
      : tickers,
  };
}

export async function fetchCompanyNews(
  ticker: string,
  daysBack = 7
): Promise<NewsArticle[]> {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - daysBack);

  const fromStr = from.toISOString().split('T')[0]!;
  const toStr = to.toISOString().split('T')[0]!;
  const params = new URLSearchParams({
    symbol: ticker,
    from: fromStr,
    to: toStr,
    token: process.env.FINNHUB_API_KEY!,
  });

  const res = await fetch(`${BASE_URL}/company-news?${params}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(`[finnhub] company-news ${ticker}: ${res.status}`);
    return [];
  }

  const items: FinnhubNewsItem[] = await res.json();
  return items.slice(0, 10).map((item) => toNewsArticle(item, [ticker]));
}

export async function fetchMarketNews(
  category = 'general'
): Promise<NewsArticle[]> {
  const params = new URLSearchParams({
    category,
    token: process.env.FINNHUB_API_KEY!,
  });

  const res = await fetch(`${BASE_URL}/news?${params}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(`[finnhub] market-news: ${res.status}`);
    return [];
  }

  const items: FinnhubNewsItem[] = await res.json();
  return items.slice(0, 20).map((item) => toNewsArticle(item));
}
