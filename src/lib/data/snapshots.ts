import 'server-only';
import { sql } from '@/lib/db';
import { FUND_INCEPTION, PORTFOLIO_BASE_VALUE } from '@/lib/constants';
import { getPricesForStrategy } from './yahoo-finance';
import { getCryptoPrices } from './coingecko';
import type { Strategy } from '@/lib/strategies/types';
import type { EquityPoint } from '@/types/prices';
import YahooFinance from 'yahoo-finance2';

const yf = new YahooFinance();

export interface PortfolioSnapshot {
  strategySlug: string;
  date: string;
  dailyReturnPct: number;
  cumulativeReturnPct: number;
  portfolioValue: number;
  holdings: Record<string, { price: number; changePct: number }>;
}

let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_snapshots (
      id SERIAL PRIMARY KEY,
      strategy_slug TEXT NOT NULL,
      date DATE NOT NULL,
      daily_return_pct REAL NOT NULL,
      cumulative_return_pct REAL NOT NULL,
      portfolio_value REAL NOT NULL,
      holdings JSONB NOT NULL,
      UNIQUE(strategy_slug, date)
    )
  `;
  tableReady = true;
}

function rowToSnapshot(row: Record<string, unknown>): PortfolioSnapshot {
  return {
    strategySlug: row.strategy_slug as string,
    date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : String(row.date).slice(0, 10),
    dailyReturnPct: row.daily_return_pct as number,
    cumulativeReturnPct: row.cumulative_return_pct as number,
    portfolioValue: row.portfolio_value as number,
    holdings: row.holdings as Record<string, { price: number; changePct: number }>,
  };
}

export async function getOrCreateTodaySnapshot(
  strategy: Strategy
): Promise<PortfolioSnapshot> {
  await ensureTable();
  const today = new Date().toISOString().slice(0, 10);

  // Check if today's snapshot exists
  const existing = await sql`
    SELECT * FROM portfolio_snapshots
    WHERE strategy_slug = ${strategy.slug} AND date = ${today}
  `;
  if (existing.length > 0) return rowToSnapshot(existing[0]!);

  // Check if any snapshots exist — if not, backfill first
  const count = await sql`
    SELECT COUNT(*) as cnt FROM portfolio_snapshots
    WHERE strategy_slug = ${strategy.slug}
  `;
  if (Number(count[0]!.cnt) === 0) {
    await backfillSnapshots(strategy);
    // Re-check for today
    const afterBackfill = await sql`
      SELECT * FROM portfolio_snapshots
      WHERE strategy_slug = ${strategy.slug} AND date = ${today}
    `;
    if (afterBackfill.length > 0) return rowToSnapshot(afterBackfill[0]!);
  }

  // Get latest previous snapshot
  const prev = await sql`
    SELECT * FROM portfolio_snapshots
    WHERE strategy_slug = ${strategy.slug} AND date < ${today}
    ORDER BY date DESC LIMIT 1
  `;
  const prevCumulative = prev.length > 0 ? (prev[0]!.cumulative_return_pct as number) : 0;

  // Fetch live prices
  const [stockResult, cryptoResult] = await Promise.all([
    getPricesForStrategy(strategy),
    getCryptoPrices(strategy),
  ]);
  const prices = { ...stockResult.data, ...cryptoResult.data };

  // Calculate weighted daily return
  let weightedReturn = 0;
  const holdings: Record<string, { price: number; changePct: number }> = {};
  for (const alloc of strategy.allocations) {
    const p = prices[alloc.ticker];
    const changePct = p?.change24h ?? 0;
    weightedReturn += alloc.weight * changePct;
    holdings[alloc.ticker] = { price: p?.price ?? 0, changePct };
  }

  const dailyReturnPct = Math.round(weightedReturn * 100) / 100;
  const cumulativeReturnPct =
    Math.round(((1 + prevCumulative / 100) * (1 + dailyReturnPct / 100) - 1) * 10000) / 100;
  const portfolioValue = Math.round(PORTFOLIO_BASE_VALUE * (1 + cumulativeReturnPct / 100));

  // Store
  await sql`
    INSERT INTO portfolio_snapshots (strategy_slug, date, daily_return_pct, cumulative_return_pct, portfolio_value, holdings)
    VALUES (${strategy.slug}, ${today}, ${dailyReturnPct}, ${cumulativeReturnPct}, ${portfolioValue}, ${JSON.stringify(holdings)}::jsonb)
    ON CONFLICT (strategy_slug, date) DO UPDATE SET
      daily_return_pct = ${dailyReturnPct},
      cumulative_return_pct = ${cumulativeReturnPct},
      portfolio_value = ${portfolioValue},
      holdings = ${JSON.stringify(holdings)}::jsonb
  `;

  return {
    strategySlug: strategy.slug,
    date: today,
    dailyReturnPct,
    cumulativeReturnPct,
    portfolioValue,
    holdings,
  };
}

export async function getSnapshotHistory(slug: string): Promise<EquityPoint[]> {
  await ensureTable();

  const rows = await sql`
    SELECT date, cumulative_return_pct FROM portfolio_snapshots
    WHERE strategy_slug = ${slug}
    ORDER BY date ASC
  `;

  return rows.map((row) => ({
    date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : String(row.date).slice(0, 10),
    value: row.cumulative_return_pct as number,
  }));
}

async function backfillSnapshots(strategy: Strategy): Promise<void> {
  const inception = new Date(FUND_INCEPTION);
  const today = new Date();

  // Fetch historical prices for stocks via yahoo-finance chart API
  const nonCrypto = strategy.allocations.filter((a) => a.assetClass !== 'crypto');
  const crypto = strategy.allocations.filter((a) => a.assetClass === 'crypto');

  // Stock historical: use chart() which works in current yahoo-finance2
  const stockHistory: Map<string, Map<string, number>> = new Map(); // date -> ticker -> price
  for (const alloc of nonCrypto) {
    try {
      const result = await yf.chart(alloc.ticker, {
        period1: inception,
        period2: today,
        interval: '1d',
      });
      if (result?.quotes) {
        for (const q of result.quotes) {
          const date = q.date instanceof Date
            ? q.date.toISOString().slice(0, 10)
            : String(q.date).slice(0, 10);
          if (!stockHistory.has(date)) stockHistory.set(date, new Map());
          const price = typeof q.close === 'number' ? q.close : (typeof q.adjClose === 'number' ? q.adjClose : 0);
          stockHistory.get(date)!.set(alloc.ticker, price);
        }
      }
    } catch (e) {
      console.error(`[backfill] chart(${alloc.ticker}) failed:`, e);
    }
  }

  // Crypto historical: use CoinGecko market_chart
  const cryptoHistory: Map<string, Map<string, number>> = new Map();
  for (const alloc of crypto) {
    try {
      const days = Math.ceil((today.getTime() - inception.getTime()) / (24 * 60 * 60 * 1000));
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${alloc.ticker}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const data = (await res.json()) as { prices: [number, number][] };
        for (const [ts, price] of data.prices) {
          const date = new Date(ts).toISOString().slice(0, 10);
          if (!cryptoHistory.has(date)) cryptoHistory.set(date, new Map());
          cryptoHistory.get(date)!.set(alloc.ticker, price);
        }
      }
    } catch (e) {
      console.error(`[backfill] coingecko(${alloc.ticker}) failed:`, e);
    }
  }

  // Merge all dates and compute daily snapshots
  const allDates = new Set<string>();
  for (const date of stockHistory.keys()) allDates.add(date);
  for (const date of cryptoHistory.keys()) allDates.add(date);
  const sortedDates = Array.from(allDates).filter((d) => d >= FUND_INCEPTION).sort();

  if (sortedDates.length === 0) return;

  let prevPrices: Map<string, number> | null = null;
  let cumulativeReturnPct = 0;

  for (const date of sortedDates) {
    const stockPrices = stockHistory.get(date) ?? new Map();
    const cryptoPrices = cryptoHistory.get(date) ?? new Map();

    // Collect all available prices for this date
    const todayPrices = new Map<string, number>();
    for (const alloc of strategy.allocations) {
      const price = stockPrices.get(alloc.ticker) ?? cryptoPrices.get(alloc.ticker);
      if (price !== undefined) todayPrices.set(alloc.ticker, price);
    }

    // Need at least some data
    if (todayPrices.size === 0) continue;

    if (prevPrices === null) {
      prevPrices = todayPrices;
      // Inception day: 0% return
      const holdings: Record<string, { price: number; changePct: number }> = {};
      for (const [ticker, price] of todayPrices) {
        holdings[ticker] = { price, changePct: 0 };
      }
      await sql`
        INSERT INTO portfolio_snapshots (strategy_slug, date, daily_return_pct, cumulative_return_pct, portfolio_value, holdings)
        VALUES (${strategy.slug}, ${date}, ${0}, ${0}, ${PORTFOLIO_BASE_VALUE}, ${JSON.stringify(holdings)}::jsonb)
        ON CONFLICT (strategy_slug, date) DO NOTHING
      `;
      continue;
    }

    // Calculate weighted daily return
    let dailyReturn = 0;
    const holdings: Record<string, { price: number; changePct: number }> = {};
    for (const alloc of strategy.allocations) {
      const curr = todayPrices.get(alloc.ticker);
      const prev = prevPrices.get(alloc.ticker);
      if (curr !== undefined && prev !== undefined && prev !== 0) {
        const changePct = ((curr - prev) / prev) * 100;
        dailyReturn += alloc.weight * changePct;
        holdings[alloc.ticker] = { price: curr, changePct: Math.round(changePct * 100) / 100 };
      } else if (curr !== undefined) {
        holdings[alloc.ticker] = { price: curr, changePct: 0 };
      }
    }

    const dailyReturnPct = Math.round(dailyReturn * 100) / 100;
    cumulativeReturnPct =
      Math.round(((1 + cumulativeReturnPct / 100) * (1 + dailyReturnPct / 100) - 1) * 10000) / 100;
    const portfolioValue = Math.round(PORTFOLIO_BASE_VALUE * (1 + cumulativeReturnPct / 100));

    await sql`
      INSERT INTO portfolio_snapshots (strategy_slug, date, daily_return_pct, cumulative_return_pct, portfolio_value, holdings)
      VALUES (${strategy.slug}, ${date}, ${dailyReturnPct}, ${cumulativeReturnPct}, ${portfolioValue}, ${JSON.stringify(holdings)}::jsonb)
      ON CONFLICT (strategy_slug, date) DO NOTHING
    `;

    // Update prev prices with today's (carry forward available ones)
    for (const [ticker, price] of todayPrices) {
      prevPrices.set(ticker, price);
    }
  }
}
