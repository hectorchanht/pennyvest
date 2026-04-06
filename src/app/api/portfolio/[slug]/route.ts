import type { NextRequest } from 'next/server';
import { getStrategyConfig } from '@/lib/strategies';
import { getPricesForStrategy } from '@/lib/data/yahoo-finance';
import { getCryptoPrices } from '@/lib/data/coingecko';

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

    const [stockResult, cryptoResult] = await Promise.all([
      getPricesForStrategy(strategy),
      getCryptoPrices(strategy),
    ]);

    const prices = { ...stockResult.data, ...cryptoResult.data };

    // Calculate weighted portfolio daily gain
    const portfolioValue = 1_000_000; // simulated $1M
    let weightedDailyGainPct = 0;

    const holdings = strategy.allocations.map((alloc) => {
      const priceData = prices[alloc.ticker];
      const dailyChangePct = priceData?.change24h ?? 0;
      const marketValue = portfolioValue * alloc.weight;
      const changeAmt = marketValue * (dailyChangePct / 100);

      weightedDailyGainPct += alloc.weight * dailyChangePct;

      return {
        ticker: alloc.ticker,
        weight: alloc.weight,
        price: priceData?.price ?? 0,
        dailyChangePct,
        marketValue,
        changeAmt,
      };
    });

    return Response.json({
      slug,
      portfolioValue,
      dailyGainPct: Math.round(weightedDailyGainPct * 100) / 100,
      holdings,
      cachedAt: Math.min(stockResult.cachedAt, cryptoResult.cachedAt),
    });
  } catch (error) {
    console.error('[api/portfolio]', error);
    return Response.json(
      { error: 'Portfolio data temporarily unavailable' },
      { status: 503 }
    );
  }
}
