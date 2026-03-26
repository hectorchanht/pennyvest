import 'server-only';
import { openai } from '@ai-sdk/openai';

// Provider-agnostic via AI SDK abstraction.
// To swap provider: change this one line to e.g. anthropic('claude-3-haiku-20240307') or google('gemini-1.5-flash').
export const model = openai('gpt-4o-mini');
