import type { NextRequest } from 'next/server';
import { getStrategyConfig } from '@/lib/strategies';
import { getStrategyInsights } from '@/lib/data/insights';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const strategy = getStrategyConfig(slug);
    if (!strategy) {
      return Response.json({ error: 'Strategy not found' }, { status: 404 });
    }

    const locale = new URL(req.url).searchParams.get('locale') || 'en';
    const result = await getStrategyInsights(strategy, locale);

    return Response.json(result);
  } catch (error) {
    console.error('[api/insights]', error);
    return Response.json(
      { error: 'Insights temporarily unavailable' },
      { status: 503 }
    );
  }
}
