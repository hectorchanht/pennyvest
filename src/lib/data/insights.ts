import 'server-only';
import { generateText } from 'ai';
import { model } from '@/lib/ai/openrouter';
import { buildInsightsPrompt } from '@/lib/ai/insights-prompt';
import { withCache } from './cache';
import { getRecommendations } from './recommendations';
import { getPricesForStrategy } from './yahoo-finance';
import { getCryptoPrices } from './coingecko';
import { getNewsForStrategy } from './news';
import { getOrCreateTodaySnapshot } from './snapshots';
import type { Strategy } from '@/lib/strategies/types';

export interface OpportunityData {
  title: string;
  description: string;
  confidence: number;
  horizon: string;
  logic: string;
  catalysts: string[];
  risks: string[];
  actions: Array<{ ticker: string; action: 'hold' | 'add' | 'reduce' }>;
}

export interface PortfolioNotesData {
  actionSummary: string;
  description: string;
  holdingAdjustments: Array<{
    ticker: string;
    action: 'hold' | 'add' | 'reduce';
    reasoning: string;
  }>;
  riskNote: string;
  cashNote: string;
}

export interface StrategyInsights {
  opportunities: OpportunityData[];
  portfolioNotes: PortfolioNotesData;
}

const FALLBACK: StrategyInsights = {
  opportunities: [],
  portfolioNotes: {
    actionSummary: 'Hold',
    description: 'AI analysis temporarily unavailable.',
    holdingAdjustments: [],
    riskNote: 'Maintain existing risk parameters.',
    cashNote: 'No change to cash allocation.',
  },
};

export async function getStrategyInsights(
  strategy: Strategy,
  locale: string
): Promise<{ data: StrategyInsights; cachedAt: number }> {
  return withCache<StrategyInsights>(
    `insights:${strategy.slug}:${locale}`,
    86400, // 24 hours
    async () => {
      try {
        // Gather all context in parallel
        const nonCryptoTickers = strategy.allocations
          .filter((a) => a.assetClass !== 'crypto')
          .map((a) => a.ticker);

        const [stockPrices, cryptoPrices, recsResult, newsResult, snapshot] = await Promise.all([
          getPricesForStrategy(strategy),
          getCryptoPrices(strategy),
          getRecommendations(nonCryptoTickers),
          getNewsForStrategy(strategy, 5),
          getOrCreateTodaySnapshot(strategy),
        ]);

        const allPrices = { ...stockPrices.data, ...cryptoPrices.data };

        // Build price map for prompt
        const priceMap: Record<string, { price: number; changePct: number }> = {};
        for (const alloc of strategy.allocations) {
          const p = allPrices[alloc.ticker];
          priceMap[alloc.ticker] = {
            price: p?.price ?? 0,
            changePct: p?.change24h ?? 0,
          };
        }

        const prompt = buildInsightsPrompt({
          strategyName: strategy.slug.replace(/-/g, ' '),
          strategySlug: strategy.slug,
          allocations: strategy.allocations,
          prices: priceMap,
          recommendations: recsResult.data,
          newsHeadlines: newsResult.articles.map((a) => a.headline),
          cumulativeReturnPct: snapshot.cumulativeReturnPct,
          locale,
        });

        const { text } = await generateText({
          model,
          prompt,
          maxTokens: 2000,
        });

        // Parse JSON from response — handle potential markdown fences
        let jsonStr = text.trim();
        if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }
        // Strip <think> tags if present (Qwen sometimes adds these)
        jsonStr = jsonStr.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        const parsed = JSON.parse(jsonStr) as StrategyInsights;

        // Validate structure
        if (!parsed.opportunities || !parsed.portfolioNotes) {
          console.error('[insights] Invalid AI response structure');
          return FALLBACK;
        }

        return parsed;
      } catch (e) {
        console.error('[insights] AI generation failed:', e);
        return FALLBACK;
      }
    }
  );
}
