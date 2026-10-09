import 'server-only';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText as aiGenerateText } from 'ai';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://pennyvest.space',
    'X-Title': 'Pennyvest',
  },
});

// Free-tier `:free` models, tried in order. OpenRouter rotates its free roster —
// keep this list current (verified 2026-10-09).
export const FREE_MODELS = [
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'google/gemma-4-31b-it:free',
  'meta-llama/llama-3.3-70b-instruct:free',
] as const;

type GenerateArgs = Omit<Parameters<typeof aiGenerateText>[0], 'model'>;

/**
 * generateText with free-model failover: if a `:free` model errors
 * (retired 404, saturated 429, 402/403), retry with the next one.
 * Throws only if every model fails — callers degrade gracefully.
 */
export async function generateTextWithFailover(args: GenerateArgs) {
  let lastError: unknown = null;
  for (const id of FREE_MODELS) {
    try {
      return await aiGenerateText({ ...args, model: openrouter(id) });
    } catch (e) {
      lastError = e;
      console.warn(`[openrouter] model ${id} failed, trying next:`, e);
    }
  }
  throw lastError;
}
