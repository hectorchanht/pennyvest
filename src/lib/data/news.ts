import 'server-only';
import { withCache, TTL } from './cache';
import type { RawNewsItem } from '@/types/news';
import type { Strategy } from '@/lib/strategies/types';

const MARKETAUX_URL = 'https://api.marketaux.com/v1/news/all';

export async function getNewsForStrategy(
  strategy: Strategy,
  limit = 5
): Promise<{ data: RawNewsItem[]; cachedAt: number }> {
  // Use top 3 tickers by weight, filtering out crypto (marketaux handles stocks/ETFs)
  const topTickers = strategy.allocations
    .filter((a) => a.assetClass !== 'crypto')
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((a) => a.ticker);

  return withCache<RawNewsItem[]>(
    `news:${strategy.slug}`,
    TTL.news,
    async () => {
      try {
        const params = new URLSearchParams({
          api_token: process.env.MARKETAUX_API_KEY!,
          symbols: topTickers.join(','),
          language: 'en',
          limit: String(limit),
        });

        const response = await fetch(`${MARKETAUX_URL}?${params.toString()}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(
            `[news] getNewsForStrategy failed: ${response.status} ${response.statusText}`
          );
        }

        const json = (await response.json()) as {
          data: Array<{
            uuid: string;
            title: string;
            description?: string;
            snippet?: string;
            url: string;
            source: string;
            published_at: string;
          }>;
        };

        return json.data.map((item) => ({
          uuid: item.uuid,
          title: item.title,
          description: item.description ?? item.snippet ?? '',
          url: item.url,
          source: item.source,
          publishedAt: item.published_at,
        }));
      } catch (e) {
        console.error('[news] getNewsForStrategy failed:', e);
        throw e;
      }
    }
  );
}
