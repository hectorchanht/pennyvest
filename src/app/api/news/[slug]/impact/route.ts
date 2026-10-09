import type { NextRequest } from 'next/server';
import { getStrategyConfig } from '@/lib/strategies';
import { getNewsForStrategy } from '@/lib/data/news';
import { analyzeNewsItem } from '@/lib/ai/analyzer';
import type { NewsImpact } from '@/types/news';

// AI calls can take a while on free-tier models; results are cached per
// article in the DB, so only the first uncached hit pays this cost.
export const maxDuration = 60;

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

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json({ impacts: {}, cachedAt: Date.now(), unavailable: true });
    }

    const locale = req.nextUrl.searchParams.get('locale') === 'zh-HK' ? 'zh-HK' : 'en';
    const { articles } = await getNewsForStrategy(strategy, 5);

    const context =
      `${strategy.slug} (${strategy.riskLevel} risk): ` +
      strategy.allocations
        .map((a) => `${a.ticker} ${Math.round(a.weight * 100)}%`)
        .join(', ');

    const entries = await Promise.all(
      articles.map(async (a) => {
        const { data } = await analyzeNewsItem(
          {
            uuid: a.id,
            title: a.headline,
            description: a.summary,
            url: a.url,
            source: a.source,
            publishedAt: a.publishedAt,
          },
          context,
          locale
        );
        return [a.id, data ? { impact: data.impact, reasoning: data.reasoning } : null] as const;
      })
    );

    const impacts: Record<string, { impact: NewsImpact; reasoning: string }> = {};
    for (const [id, v] of entries) {
      if (v) impacts[id] = v;
    }

    return Response.json({ impacts, cachedAt: Date.now() });
  } catch (error) {
    console.error('[api/news/impact]', error);
    return Response.json(
      { error: 'Impact analysis temporarily unavailable' },
      { status: 503 }
    );
  }
}
