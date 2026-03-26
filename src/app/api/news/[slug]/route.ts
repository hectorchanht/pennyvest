import type { NextRequest } from 'next/server';
import { getStrategyConfig } from '@/lib/strategies';
import { getNewsForStrategy } from '@/lib/data/news';
import { analyzeNewsItem } from '@/lib/ai/analyzer';
import type { NewsItem } from '@/types/news';

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

    const locale = (
      new URL(req.url).searchParams.get('locale') || 'en'
    ) as 'en' | 'zh-HK';

    const newsResult = await getNewsForStrategy(strategy);

    const strategyContext = strategy.allocations
      .map((a) => `${a.ticker} ${Math.round(a.weight * 100)}%`)
      .join(', ');

    const analysisResults = await Promise.allSettled(
      newsResult.data.map((article) =>
        analyzeNewsItem(article, strategyContext, locale)
      )
    );

    const articles: NewsItem[] = newsResult.data.map((article, i) => {
      const result = analysisResults[i];
      const analysis =
        result?.status === 'fulfilled' && result.value.data !== null
          ? result.value.data
          : null;
      return { ...article, analysis };
    });

    return Response.json({ articles, cachedAt: newsResult.cachedAt });
  } catch (error) {
    console.error('[api/news]', error);
    return Response.json(
      { error: 'News data temporarily unavailable' },
      { status: 503 }
    );
  }
}
