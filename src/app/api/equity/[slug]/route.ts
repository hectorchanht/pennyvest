import type { NextRequest } from 'next/server';
import { getStrategyConfig } from '@/lib/strategies';
import { getSnapshotHistory, getOrCreateTodaySnapshot } from '@/lib/data/snapshots';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const strategy = getStrategyConfig(slug);
    if (!strategy) {
      return Response.json({ error: 'Strategy not found' }, { status: 404 });
    }

    // Ensure today's snapshot exists (triggers backfill if needed)
    await getOrCreateTodaySnapshot(strategy);

    // Return full history as equity curve
    const curve = await getSnapshotHistory(slug);

    return Response.json({
      curve,
      cachedAt: Date.now(),
    });
  } catch (error) {
    console.error('[api/equity]', error);
    return Response.json(
      { error: 'Equity data temporarily unavailable' },
      { status: 503 }
    );
  }
}
