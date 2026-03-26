'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import type { EquityResponse } from '@/types/prices';

const EquityCurve = dynamic(
  () => import('@/components/charts/EquityCurve'),
  { ssr: false, loading: () => <Skeleton className="h-[180px] w-full rounded-lg" /> }
);

interface EquitySectionProps {
  slug: string;
  labels: {
    equityTitle: string;
    simulatedLabel: string;
    error: string;
    retry: string;
    lastUpdated: string;
    staleWarning: string;
  };
  staleTtlMs: number;
}

function getRelativeTime(cachedAt: number): string {
  const diffMs = Date.now() - cachedAt;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr} hr ago`;
}

export default function EquitySection({ slug, labels, staleTtlMs }: EquitySectionProps) {
  const [data, setData] = useState<EquityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/equity/${slug}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as EquityResponse;
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Skeleton className="h-[200px] w-full rounded-lg" />;
  }

  if (error || !data) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-4">
          <p className="text-sm text-text-secondary mb-3">{labels.error}</p>
          <button
            onClick={fetchData}
            className="text-sm text-primary underline hover:no-underline"
          >
            {labels.retry}
          </button>
        </CardContent>
      </Card>
    );
  }

  const cachedAt = data.cachedAt ?? 0;
  const isStale = cachedAt > 0 && Date.now() - cachedAt > staleTtlMs;
  const relativeTime = cachedAt > 0 ? getRelativeTime(cachedAt) : '';

  return (
    <div>
      <EquityCurve
        data={data.curve}
        simulatedLabel={labels.simulatedLabel}
        title={labels.equityTitle}
      />
      <div className="flex items-center gap-3 mt-2">
        {relativeTime && (
          <p className="text-xs text-text-muted">
            {labels.lastUpdated.replace('{time}', relativeTime)}
          </p>
        )}
        {isStale && (
          <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            {labels.staleWarning}
          </span>
        )}
      </div>
    </div>
  );
}
