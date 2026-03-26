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

    return Response.json({
      prices,
      cachedAt: Math.min(stockResult.cachedAt, cryptoResult.cachedAt),
    });
  } catch (error) {
    console.error('[api/prices]', error);
    return Response.json(
      { error: 'Price data temporarily unavailable' },
      { status: 503 }
    );
  }
}
