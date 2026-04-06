import 'server-only';
import { sql } from '@/lib/db';

let tableReady = false;
async function ensureCacheTable() {
  if (tableReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS data_cache (
      key TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      cached_at BIGINT NOT NULL,
      expires_at BIGINT NOT NULL
    )
  `;
  tableReady = true;
}

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<{ data: T; cachedAt: number }> {
  try {
    await ensureCacheTable();
    const now = Date.now();
    const rows = await sql`
      SELECT data, cached_at FROM data_cache
      WHERE key = ${key} AND expires_at > ${now}
    `;
    if (rows.length > 0) {
      return {
        data: rows[0].data as T,
        cachedAt: rows[0].cached_at as number,
      };
    }
  } catch (e) {
    console.warn('[cache] read failed, fetching fresh:', e);
  }

  const data = await fn();
  const cachedAt = Date.now();
  const expiresAt = cachedAt + ttlSeconds * 1000;

  try {
    const jsonData = JSON.stringify(data);
    await sql`
      INSERT INTO data_cache (key, data, cached_at, expires_at)
      VALUES (${key}, ${jsonData}::jsonb, ${cachedAt}, ${expiresAt})
      ON CONFLICT (key) DO UPDATE SET
        data = ${jsonData}::jsonb,
        cached_at = ${cachedAt},
        expires_at = ${expiresAt}
    `;
  } catch (e) {
    console.warn('[cache] write failed:', e);
  }

  return { data, cachedAt };
}

export const TTL = {
  prices: 300,      // 5 min
  news: 1800,       // 30 min
  aiAnalysis: 3600, // 1 hr
  equity: 86400,    // 24 hr
} as const;
