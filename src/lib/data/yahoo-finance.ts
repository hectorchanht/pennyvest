import 'server-only';
import YahooFinance from 'yahoo-finance2';
import { withCache, TTL } from './cache';
import type { PriceData, EquityPoint } from '@/types/prices';
import type { Strategy } from '@/lib/strategies/types';

const yf = new YahooFinance();

export async function getPricesForStrategy(
  strategy: Strategy
): Promise<{ data: Record<string, PriceData>; cachedAt: number }> {
  const nonCryptoAllocations = strategy.allocations.filter(
    (a) => a.assetClass !== 'crypto'
  );

  if (nonCryptoAllocations.length === 0) {
    return { data: {}, cachedAt: Date.now() };
  }

  const tickers = nonCryptoAllocations.map((a) => a.ticker);

  return withCache<Record<string, PriceData>>(
    `prices:yahoo:${strategy.slug}`,
    TTL.prices,
    async () => {
      try {
        const quotes = await yf.quote(tickers);
        const result: Record<string, PriceData> = {};
        const quoteArray = Array.isArray(quotes) ? quotes : [quotes];
        for (const quote of quoteArray) {
          const ticker = quote.symbol;
          result[ticker] = {
            ticker,
            price: quote.regularMarketPrice ?? 0,
            change24h: quote.regularMarketChangePercent ?? null,
            currency: 'USD',
          };
        }
        return result;
      } catch (e) {
        console.error('[yahoo-finance] getPricesForStrategy failed:', e);
        throw e;
      }
    }
  );
}

export async function getHistoricalForStrategy(
  strategy: Strategy
): Promise<{ data: EquityPoint[]; cachedAt: number }> {
  const nonCryptoAllocations = strategy.allocations.filter(
    (a) => a.assetClass !== 'crypto'
  );

  return withCache<EquityPoint[]>(
    `equity:${strategy.slug}`,
    TTL.equity,
    async () => {
      try {
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

        // Fetch historical data for all non-crypto tickers
        const historicalData = await Promise.all(
          nonCryptoAllocations.map(async (alloc) => {
            const rows = await yf.historical(alloc.ticker, {
              period1: twoYearsAgo,
              interval: '1wk',
            });
            return { ticker: alloc.ticker, weight: alloc.weight, rows };
          })
        );

        // Build a map of date -> { ticker -> adjClose }
        const dateMap: Map<string, Map<string, number>> = new Map();
        for (const { ticker, rows } of historicalData) {
          for (const row of rows) {
            const date = row.date instanceof Date
              ? row.date.toISOString().slice(0, 10)
              : String(row.date).slice(0, 10);
            if (!dateMap.has(date)) dateMap.set(date, new Map());
            dateMap.get(date)!.set(ticker, row.adjClose ?? row.close);
          }
        }

        // Sort dates
        const sortedDates = Array.from(dateMap.keys()).sort();
        if (sortedDates.length < 2) return [];

        const tickers = nonCryptoAllocations.map((a) => a.ticker);

        // Compute cumulative weighted return
        const equityPoints: EquityPoint[] = [];
        let cumulativeReturn = 0;
        let prevPrices: Map<string, number> | null = null;

        for (const date of sortedDates) {
          const prices = dateMap.get(date)!;
          // Only use dates where ALL tickers have data
          const allPresent = tickers.every((t) => prices.has(t));
          if (!allPresent) continue;

          if (prevPrices === null) {
            prevPrices = prices;
            equityPoints.push({ date, value: 0 });
            continue;
          }

          // Weekly return = sum(weight * (price - prevPrice) / prevPrice)
          let weeklyReturn = 0;
          for (const alloc of nonCryptoAllocations) {
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
      } catch (e) {
        console.error('[yahoo-finance] getHistoricalForStrategy failed:', e);
        throw e;
      }
    }
  );
}
