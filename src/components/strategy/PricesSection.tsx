'use client';

import { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import HoldingsTable from '@/components/strategy/HoldingsTable';
import type { PriceResponse } from '@/types/prices';

interface Allocation {
  ticker: string;
  name: string;
  weight: number;
}

interface PricesSectionProps {
  slug: string;
  allocations: Allocation[];
  labels: {
    ticker: string;
    name: string;
    weight: string;
    price: string;
    change24h: string;
    loading: string;
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

export default function PricesSection({ slug, allocations, labels, staleTtlMs }: PricesSectionProps) {
  const [data, setData] = useState<PriceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/prices/${slug}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as PriceResponse;
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
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
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
      <HoldingsTable
        allocations={allocations}
        labels={{ ticker: labels.ticker, name: labels.name, weight: labels.weight }}
        prices={data.prices}
        priceLabels={{ price: labels.price, change24h: labels.change24h }}
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
