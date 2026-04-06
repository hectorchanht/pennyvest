import type { NextRequest } from 'next/server';
import { getStrategyConfig } from '@/lib/strategies';
import { getOrCreateTodaySnapshot } from '@/lib/data/snapshots';

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

    const snapshot = await getOrCreateTodaySnapshot(strategy);

    return Response.json({
      slug,
      portfolioValue: snapshot.portfolioValue,
      dailyGainPct: snapshot.dailyReturnPct,
      cumulativeReturnPct: snapshot.cumulativeReturnPct,
      holdings: Object.entries(snapshot.holdings).map(([ticker, data]) => {
        const alloc = strategy.allocations.find((a) => a.ticker === ticker);
        return {
          ticker,
          weight: alloc?.weight ?? 0,
          price: data.price,
          dailyChangePct: data.changePct,
        };
      }),
      cachedAt: Date.now(),
    });
  } catch (error) {
    console.error('[api/portfolio]', error);
    return Response.json(
      { error: 'Portfolio data temporarily unavailable' },
      { status: 503 }
    );
  }
}
