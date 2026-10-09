import 'server-only';
import { Output } from 'ai';
import { z } from 'zod';
import { generateTextWithFailover } from './openrouter';
import { buildSystemPrompt, buildAnalysisPrompt } from './prompts';
import { withCache, TTL } from '@/lib/data/cache';

export interface NewsAnalysis {
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
      if (!process.env.OPENROUTER_API_KEY) {
        console.warn('[analyzer] OPENROUTER_API_KEY not set, skipping AI analysis');
        return null;
      }
      try {
        const result = await generateTextWithFailover({
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
