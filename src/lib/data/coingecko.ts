import 'server-only';
import { withCache, TTL } from './cache';
import type { PriceData, EquityPoint } from '@/types/prices';
import type { Strategy } from '@/lib/strategies/types';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

function getCoinGeckoHeaders(): HeadersInit {
  const apiKey = process.env.COINGECKO_API_KEY;
  if (apiKey) {
    return { 'x-cg-demo-api-key': apiKey };
  }
  return {};
}

export async function getCryptoPrices(
  strategy: Strategy
): Promise<{ data: Record<string, PriceData>; cachedAt: number }> {
  const cryptoAllocations = strategy.allocations.filter(
    (a) => a.assetClass === 'crypto'
  );

  if (cryptoAllocations.length === 0) {
    return { data: {}, cachedAt: Date.now() };
  }

  const ids = cryptoAllocations.map((a) => a.ticker);

  return withCache<Record<string, PriceData>>(
    `prices:coingecko:${strategy.slug}`,
    TTL.prices,
    async () => {
      const params = new URLSearchParams({
        vs_currency: 'usd',
        ids: ids.join(','),
        price_change_percentage: '24h',
      });

      const response = await fetch(
        `${COINGECKO_BASE}/coins/markets?${params.toString()}`,
        {
          cache: 'no-store',
          headers: getCoinGeckoHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `[coingecko] getCryptoPrices failed: ${response.status} ${response.statusText}`
        );
      }

      const coins = (await response.json()) as Array<{
        id: string;
        current_price: number;
        price_change_percentage_24h: number | null;
      }>;

      const result: Record<string, PriceData> = {};
      for (const coin of coins) {
        result[coin.id] = {
          ticker: coin.id,
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h ?? null,
          currency: 'USD',
        };
      }
      return result;
    }
  );
}

export async function getCryptoHistorical(
  strategy: Strategy
): Promise<{ data: EquityPoint[]; cachedAt: number }> {
  const cryptoAllocations = strategy.allocations.filter(
    (a) => a.assetClass === 'crypto'
  );

  if (cryptoAllocations.length === 0) {
    return { data: [], cachedAt: Date.now() };
  }

  return withCache<EquityPoint[]>(
    `equity:crypto:${strategy.slug}`,
    TTL.equity,
    async () => {
      // Fetch OHLC for each crypto (2 years = 730 days)
      const ohlcData = await Promise.all(
        cryptoAllocations.map(async (alloc) => {
          const params = new URLSearchParams({
            vs_currency: 'usd',
            days: '730',
          });
          const response = await fetch(
            `${COINGECKO_BASE}/coins/${alloc.ticker}/ohlc?${params.toString()}`,
            {
              cache: 'no-store',
              headers: getCoinGeckoHeaders(),
            }
          );
          if (!response.ok) {
            console.warn(
              `[coingecko] OHLC fetch failed for ${alloc.ticker}: ${response.status}`
            );
            return { ticker: alloc.ticker, weight: alloc.weight, points: [] as [number, number, number, number, number][] };
          }
          const data = (await response.json()) as [number, number, number, number, number][];
          return { ticker: alloc.ticker, weight: alloc.weight, points: data };
        })
      );

      // Downsample to weekly: take one point per 7-day bucket
      // Build a map of weekBucket -> Map(ticker -> close)
      const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
      const bucketMap: Map<number, Map<string, number>> = new Map();

      for (const { ticker, points } of ohlcData) {
        for (const [timestamp, , , , close] of points) {
          const bucket = Math.floor(timestamp / MS_PER_WEEK);
          if (!bucketMap.has(bucket)) bucketMap.set(bucket, new Map());
          bucketMap.get(bucket)!.set(ticker, close);
        }
      }

      const sortedBuckets = Array.from(bucketMap.keys()).sort((a, b) => a - b);

      if (sortedBuckets.length < 2) return [];

      const tickers = cryptoAllocations.map((a) => a.ticker);
      const equityPoints: EquityPoint[] = [];
      let cumulativeReturn = 0;
      let prevPrices: Map<string, number> | null = null;

      for (const bucket of sortedBuckets) {
        const prices = bucketMap.get(bucket)!;
        const allPresent = tickers.every((t) => prices.has(t));
        if (!allPresent) continue;

        const date = new Date(bucket * MS_PER_WEEK).toISOString().slice(0, 10);

        if (prevPrices === null) {
          prevPrices = prices;
          equityPoints.push({ date, value: 0 });
          continue;
        }

        let weeklyReturn = 0;
        for (const alloc of cryptoAllocations) {
          const prev = prevPrices.get(alloc.ticker);
          const curr = prices.get(alloc.ticker);
          if (prev !== undefined && curr !== undefined && prev !== 0) {
            weeklyReturn += alloc.weight * ((curr - prev) / prev);
          }
        }

        cumulativeReturn = (1 + cumulativeReturn / 100) * (1 + weeklyReturn) * 100 - 100;
        equityPoints.push({ date, value: parseFloat(cumulativeReturn.toFixed(4)) });
        prevPrices = prices;
      }

      return equityPoints;
    }
  );
}
