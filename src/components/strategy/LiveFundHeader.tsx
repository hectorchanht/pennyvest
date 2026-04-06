'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import FundHeader from './FundHeader';

interface LiveFundHeaderProps {
  slug: string;
  fundName: string;
  labels: {
    trackingLive: string;
    modelPortfolio: string;
    dailyGain: string;
    portfolioValue: string;
  };
}

interface PortfolioData {
  dailyGainPct: number;
  portfolioValue: number;
}

export default function LiveFundHeader({ slug, fundName, labels }: LiveFundHeaderProps) {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    fetch(`/api/portfolio/${slug}`)
      .then((res) => res.ok ? res.json() : null)
      .then((json) => {
        if (json) setData(json);
      })
      .catch(() => {});
  }, [slug]);

  const dailyGainPct = data?.dailyGainPct ?? 0;
  const portfolioValue = data?.portfolioValue ?? 1_000_000;
  const dailyGainAmt = portfolioValue * (dailyGainPct / 100);

  const stats = [
    {
      label: labels.dailyGain,
      value: data ? `${dailyGainPct >= 0 ? '+' : ''}${dailyGainPct.toFixed(2)}%` : '—',
      isPositive: dailyGainPct > 0,
      isNegative: dailyGainPct < 0,
    },
    {
      label: labels.portfolioValue,
      value: data
        ? `$${(portfolioValue + dailyGainAmt).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
        : '—',
    },
  ];

  const today = new Date().toISOString().split('T')[0]!;

  if (!data) {
    return (
      <div className="bg-surface rounded-xl p-6 mb-6 border border-border space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <FundHeader
      fundName={fundName}
      date={today}
      stats={stats}
      labels={{
        trackingLive: labels.trackingLive,
        modelPortfolio: labels.modelPortfolio,
      }}
    />
  );
}
