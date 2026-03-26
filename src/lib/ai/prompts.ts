export function buildSystemPrompt(locale: 'en' | 'zh-HK'): string {
  return `You are a financial news analyst. ${locale === 'zh-HK' ? 'Respond entirely in Traditional Chinese (zh-HK).' : 'Respond in English.'}
Summarize only what the article states. Do NOT invent figures, prices, or percentages not in the article.
Assess impact on the provided portfolio allocation.`;
}

export function buildAnalysisPrompt(
  article: { title: string; description: string },
  strategyContext: string
): string {
  return `Portfolio: ${strategyContext}

Article title: ${article.title}
Article content: ${article.description}`;
}
