import type { AnalystRecommendation } from '@/lib/data/recommendations';

interface InsightsContext {
  strategyName: string;
  strategySlug: string;
  allocations: Array<{ ticker: string; weight: number; assetClass: string }>;
  prices: Record<string, { price: number; changePct: number }>;
  recommendations: Record<string, AnalystRecommendation>;
  newsHeadlines: string[];
  cumulativeReturnPct: number;
  locale: string;
}

export function buildInsightsPrompt(ctx: InsightsContext): string {
  const lang = ctx.locale === 'zh-HK' ? 'Traditional Chinese (Hong Kong style)' : 'English';

  const holdingsInfo = ctx.allocations
    .map((a) => {
      const price = ctx.prices[a.ticker];
      const rec = ctx.recommendations[a.ticker];
      const recStr = rec
        ? `Analysts: ${rec.strongBuy + rec.buy} buy, ${rec.hold} hold, ${rec.sell + rec.strongSell} sell`
        : 'No analyst data';
      if (!price?.changePct) return null;
      return `- ${a.ticker} (${Math.round(a.weight * 100)}%, ${a.assetClass}): $${price?.price?.toFixed(2) ?? '?'} (${price?.changePct >= 0 ? '+' : ''}${price?.changePct?.toFixed(2) ?? '?'}% today) | ${recStr}`;
    })
    .join('\n');

  const newsStr = ctx.newsHeadlines.length > 0
    ? ctx.newsHeadlines.slice(0, 5).map((h) => `- ${h}`).join('\n')
    : '- No recent news available';

  return `You are a portfolio analyst for "${ctx.strategyName}" strategy.

PORTFOLIO CONTEXT:
${holdingsInfo}

Portfolio return since inception (Jan 1, 2026): ${ctx.cumulativeReturnPct >= 0 ? '+' : ''}${ctx.cumulativeReturnPct.toFixed(2)}%

RECENT NEWS:
${newsStr}

TASK: Generate investment insights in ${lang}. Return ONLY valid JSON (no markdown, no code fences, no explanation) matching this exact structure:

{
  "opportunities": [
    {
      "title": "Short title for the opportunity",
      "description": "1-2 sentence description",
      "confidence": 7,
      "horizon": "6-12 months",
      "logic": "2-3 sentence investment logic",
      "catalysts": ["catalyst 1", "catalyst 2"],
      "risks": ["risk 1", "risk 2"],
      "actions": [{"ticker": "TICKER", "action": "hold|add|reduce"}]
    }
  ],
  "portfolioNotes": {
    "actionSummary": "e.g. Hold Core + Trim Weakness",
    "description": "1-2 sentence overview of today's portfolio stance",
    "holdingAdjustments": [
      {"ticker": "TICKER", "action": "hold|add|reduce", "reasoning": "1 sentence reason"}
    ],
    "riskNote": "1-2 sentence risk management note",
    "cashNote": "1 sentence cash strategy note"
  }
}

RULES:
- Generate exactly 2 opportunities based on current market conditions and analyst sentiment
- Generate holdingAdjustments for ALL holdings in the portfolio (${ctx.allocations.length} total)
- confidence must be 1-10 integer
- action must be exactly "hold", "add", or "reduce"
- Base recommendations on the analyst consensus data and recent price movements
- Be specific about tickers and price levels
- Do NOT invent price figures — use the provided data
- Return ONLY the JSON object, nothing else`;
}
