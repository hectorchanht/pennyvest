import 'server-only';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<{ data: T; cachedAt: number }> {
  try {
    const cached = await redis.get<{ data: T; cachedAt: number }>(key);
    if (cached) return cached;
  } catch (e) {
    console.warn('[cache] Redis read failed, fetching fresh:', e);
  }

  const data = await fn();
  const result = { data, cachedAt: Date.now() };

  try {
    await redis.set(key, result, { ex: ttlSeconds });
  } catch (e) {
    console.warn('[cache] Redis write failed:', e);
  }

  return result;
}

export const TTL = {
  prices: 300, // 5 min — per D-12
  news: 1800, // 30 min — per D-12
  aiAnalysis: 3600, // 1 hr — per D-12
  equity: 86400, // 24 hr — historical data changes slowly
} as const;
