import 'server-only';
import { createOpenAI } from '@ai-sdk/openai';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://pennyvest.space',
    'X-Title': 'Pennyvest',
  },
});

export const model = openrouter('qwen/qwen3.6-plus:free');
