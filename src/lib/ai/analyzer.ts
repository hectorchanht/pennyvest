import 'server-only';
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { model } from './client';
import { buildSystemPrompt, buildAnalysisPrompt } from './prompts';
import { withCache, TTL } from '@/lib/data/cache';
// Types defined locally — not currently exported from @/types/news
interface NewsAnalysis {
  summary: string;
  impact: 'bullish' | 'neutral' | 'bearish';
  reasoning: string;
}

interface RawNewsItem {
  uuid: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

const NewsAnalysisSchema = z.object({
  summary: z.string(),
  impact: z.enum(['bullish', 'neutral', 'bearish']),
  reasoning: z.string(),
});

export async function analyzeNewsItem(
  article: RawNewsItem,
  strategyContext: string,
  locale: 'en' | 'zh-HK'
): Promise<{ data: NewsAnalysis | null; cachedAt: number }> {
  return withCache<NewsAnalysis | null>(
    `ai:${article.uuid}:${locale}`,
    TTL.aiAnalysis,
    async () => {
      try {
        const result = await generateText({
          model,
          output: Output.object({ schema: NewsAnalysisSchema }),
          system: buildSystemPrompt(locale),
          prompt: buildAnalysisPrompt(article, strategyContext),
          maxOutputTokens: 280,
        });
        return result.output as NewsAnalysis;
      } catch (e) {
        console.warn('[analyzer] analyzeNewsItem failed (graceful degradation):', e);
        return null;
      }
    }
  );
}
