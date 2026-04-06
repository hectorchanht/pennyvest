import 'server-only';
import { withCache } from './cache';

const BASE_URL = 'https://finnhub.io/api/v1';

export interface AnalystRecommendation {
  buy: number;
  hold: number;
  sell: number;
  strongBuy: number;
  strongSell: number;
  period: string;
}

export async function getRecommendations(
  tickers: string[]
): Promise<{ data: Record<string, AnalystRecommendation>; cachedAt: number }> {
  return withCache<Record<string, AnalystRecommendation>>(
    `recommendations:${tickers.sort().join(',')}`,
    86400, // 24 hours
    async () => {
      const result: Record<string, AnalystRecommendation> = {};

      for (const ticker of tickers) {
        try {
          const params = new URLSearchParams({
            symbol: ticker,
            token: process.env.FINNHUB_API_KEY!,
          });
          const res = await fetch(`${BASE_URL}/stock/recommendation?${params}`, {
            cache: 'no-store',
          });
          if (!res.ok) continue;

          const data: AnalystRecommendation[] = await res.json();
          if (data.length > 0) {
            result[ticker] = data[0]!;
          }
        } catch (e) {
          console.error(`[recommendations] ${ticker} failed:`, e);
        }
      }

      return result;
    }
  );
}
