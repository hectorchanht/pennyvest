import type { NextRequest } from 'next/server';
import { getStrategyConfig } from '@/lib/strategies';
import { getNewsForStrategy } from '@/lib/data/news';

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

    const result = await getNewsForStrategy(strategy);
    return Response.json(result);
  } catch (error) {
    console.error('[api/news]', error);
    return Response.json(
      { error: 'News data temporarily unavailable' },
      { status: 503 }
    );
  }
}
