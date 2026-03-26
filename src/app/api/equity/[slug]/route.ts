import type { NextRequest } from 'next/server';
import { getStrategyConfig } from '@/lib/strategies';
import { getHistoricalForStrategy } from '@/lib/data/yahoo-finance';
import { getCryptoHistorical } from '@/lib/data/coingecko';
import type { EquityPoint } from '@/types/prices';

function mergeEquityCurves(
  stockPoints: EquityPoint[],
  cryptoPoints: EquityPoint[]
): EquityPoint[] {
  if (stockPoints.length === 0) return cryptoPoints;
  if (cryptoPoints.length === 0) return stockPoints;

  // Build maps for fast lookup
  const stockMap = new Map<string, number>(stockPoints.map((p) => [p.date, p.value]));
  const cryptoMap = new Map<string, number>(cryptoPoints.map((p) => [p.date, p.value]));

  // Collect superset of dates
  const allDates = Array.from(
    new Set([...stockMap.keys(), ...cryptoMap.keys()])
  ).sort();

  let lastStock = 0;
  let lastCrypto = 0;
  const merged: EquityPoint[] = [];

  for (const date of allDates) {
    if (stockMap.has(date)) lastStock = stockMap.get(date)!;
    if (cryptoMap.has(date)) lastCrypto = cryptoMap.get(date)!;
    merged.push({ date, value: parseFloat((lastStock + lastCrypto).toFixed(4)) });
  }

  return merged;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const strategy = getStrategyConfig(slug);
    if (!strategy) {
      return Response.json({ error: 'Strategy not found' }, { status: 404 });
    }

    const [stockEquity, cryptoEquity] = await Promise.all([
      getHistoricalForStrategy(strategy),
      getCryptoHistorical(strategy),
    ]);

    const curve = mergeEquityCurves(stockEquity.data, cryptoEquity.data);

    return Response.json({
      curve,
      cachedAt: Math.min(stockEquity.cachedAt, cryptoEquity.cachedAt),
    });
  } catch (error) {
    console.error('[api/equity]', error);
    return Response.json(
      { error: 'Equity data temporarily unavailable' },
      { status: 503 }
    );
  }
}
