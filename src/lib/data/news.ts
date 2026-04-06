import 'server-only';
import { sql } from '@/lib/db';
import { fetchCompanyNews, fetchMarketNews } from './finnhub';
import type { NewsArticle } from '@/types/news';
import type { Strategy } from '@/lib/strategies/types';

const CACHE_TTL_SECONDS = 300; // 5 minutes

let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS news_cache (
      id TEXT PRIMARY KEY,
      strategy_slug TEXT NOT NULL,
      headline TEXT NOT NULL,
      summary TEXT,
      source TEXT,
      url TEXT,
      image_url TEXT,
      category TEXT,
      published_at TIMESTAMPTZ,
      related_tickers TEXT[],
      fetched_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  // Create index if not exists — ignore errors if it already exists
  try {
    await sql`CREATE INDEX idx_news_cache_strategy ON news_cache(strategy_slug, fetched_at DESC)`;
  } catch {
    // Index already exists
  }
  tableReady = true;
}

function rowToArticle(row: Record<string, unknown>): NewsArticle {
  return {
    id: row.id as string,
    headline: row.headline as string,
    summary: (row.summary as string) || '',
    source: (row.source as string) || '',
    url: (row.url as string) || '',
    imageUrl: (row.image_url as string) || null,
    category: (row.category as string) || 'general',
    publishedAt: row.published_at ? new Date(row.published_at as string).toISOString() : '',
    relatedTickers: (row.related_tickers as string[]) || [],
  };
}

async function getCachedNews(slug: string, limit: number): Promise<{ articles: NewsArticle[]; cachedAt: number } | null> {
  await ensureTable();

  // Check if we have fresh cache
  const cutoff = new Date(Date.now() - CACHE_TTL_SECONDS * 1000).toISOString();
  const freshCheck = await sql`
    SELECT fetched_at FROM news_cache
    WHERE strategy_slug = ${slug}
      AND fetched_at > ${cutoff}::timestamptz
    LIMIT 1
  `;

  if (freshCheck.length === 0) return null;

  const rows = await sql`
    SELECT * FROM news_cache
    WHERE strategy_slug = ${slug}
    ORDER BY published_at DESC
    LIMIT ${limit}
  `;

  if (rows.length === 0) return null;

  return {
    articles: rows.map(rowToArticle),
    cachedAt: new Date(freshCheck[0]!.fetched_at as string).getTime(),
  };
}

async function cacheNews(slug: string, articles: NewsArticle[]): Promise<void> {
  await ensureTable();

  // Delete old entries for this slug
  await sql`DELETE FROM news_cache WHERE strategy_slug = ${slug}`;

  // Insert new entries
  for (const article of articles) {
    await sql`
      INSERT INTO news_cache (id, strategy_slug, headline, summary, source, url, image_url, category, published_at, related_tickers)
      VALUES (
        ${article.id},
        ${slug},
        ${article.headline},
        ${article.summary},
        ${article.source},
        ${article.url},
        ${article.imageUrl},
        ${article.category},
        ${article.publishedAt},
        ${article.relatedTickers}
      )
      ON CONFLICT (id) DO UPDATE SET
        strategy_slug = ${slug},
        fetched_at = now()
    `;
  }
}

export async function getNewsForStrategy(
  strategy: Strategy,
  limit = 5
): Promise<{ articles: NewsArticle[]; cachedAt: number }> {
  // Check cache first
  const cached = await getCachedNews(strategy.slug, limit);
  if (cached) return cached;

  // Fetch from Finnhub — top 3 tickers by weight
  const topTickers = strategy.allocations
    .filter((a) => a.assetClass !== 'crypto')
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((a) => a.ticker);

  const allArticles: NewsArticle[] = [];
  for (const ticker of topTickers) {
    try {
      const articles = await fetchCompanyNews(ticker, 7);
      allArticles.push(...articles);
    } catch (e) {
      console.error(`[news] fetchCompanyNews(${ticker}) failed:`, e);
    }
  }

  // Deduplicate by id, sort by date, limit
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
  unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const result = unique.slice(0, limit);

  // Cache in DB
  try {
    await cacheNews(strategy.slug, result);
  } catch (e) {
    console.error('[news] cacheNews failed:', e);
  }

  return { articles: result, cachedAt: Date.now() };
}

export async function getMarketNews(
  limit = 8
): Promise<{ articles: NewsArticle[]; cachedAt: number }> {
  const slug = '__market__';

  // Check cache first
  const cached = await getCachedNews(slug, limit);
  if (cached) return cached;

  // Fetch from Finnhub
  try {
    const articles = await fetchMarketNews('general');
    const result = articles.slice(0, limit);

    await cacheNews(slug, result);
    return { articles: result, cachedAt: Date.now() };
  } catch (e) {
    console.error('[news] getMarketNews failed:', e);
    return { articles: [], cachedAt: Date.now() };
  }
}
