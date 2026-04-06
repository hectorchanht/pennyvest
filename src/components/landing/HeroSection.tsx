'use client';

import { useState, useEffect } from 'react';
import ProfileSelector from './ProfileSelector';
import type { RiskLevel } from '@/lib/strategies/types';

interface StrategyData {
  slug: string;
  name: string;
  tagline: string;
  riskLevel: RiskLevel;
  riskLabel: string;
  dailyChangePct: number;
  topHoldings: Array<{ ticker: string; weight: number }>;
}

interface HeroSectionProps {
  profiles: Array<{
    slug: string;
    name: string;
    weights: Record<string, number>;
  }>;
  strategies: StrategyData[];
  labels: {
    tagline: string;
    subtagline: string;
    profileLabel: string;
    dailyChangeLabel: string;
  };
}

export default function HeroSection({ profiles, strategies, labels }: HeroSectionProps) {
  const [liveStrategies, setLiveStrategies] = useState<StrategyData[]>(strategies);

  useEffect(() => {
    // Fetch live portfolio data for all strategies
    Promise.all(
      strategies.map((s) =>
        fetch(`/api/portfolio/${s.slug}`)
          .then((res) => res.ok ? res.json() : null)
          .catch(() => null)
      )
    ).then((results) => {
      setLiveStrategies(
        strategies.map((s, i) => {
          const live = results[i];
          if (!live) return s;
          return {
            ...s,
            dailyChangePct: live.dailyGainPct ?? s.dailyChangePct,
            topHoldings: live.holdings
              ? live.holdings
                  .sort((a: { weight: number }, b: { weight: number }) => b.weight - a.weight)
                  .slice(0, 3)
                  .map((h: { ticker: string; weight: number }) => ({
                    ticker: h.ticker,
                    weight: h.weight,
                  }))
              : s.topHoldings,
          };
        })
      );
    });
  }, [strategies]);
  return (
    <section className="pt-24 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Centered tagline */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary">
            {labels.tagline}
          </h1>
          <p className="text-base md:text-lg text-text-secondary mt-3 max-w-2xl mx-auto">
            {labels.subtagline}
          </p>
        </div>

        {/* Profile label */}
        <p className="text-text-secondary text-sm mb-3 text-center">
          {labels.profileLabel}
        </p>

        {/* Profile selector with glowing buttons, donut, and cards */}
        <ProfileSelector
          profiles={profiles}
          strategies={liveStrategies}
          labels={{
            profileLabel: labels.profileLabel,
            dailyChangeLabel: labels.dailyChangeLabel,
          }}
        />
      </div>
    </section>
  );
}
