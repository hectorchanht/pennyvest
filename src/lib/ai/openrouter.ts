import 'server-only';
import { createOpenAI } from '@ai-sdk/openai';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  compatibility: 'compatible',
});

export const model = openrouter('qwen/qwen3.6-plus:free');
