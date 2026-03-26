'use client';

import { useState } from 'react';
import StrategyCard from './StrategyCard';
import AllocationDonut, { getStrategyColor } from './AllocationDonut';
import type { RiskLevel } from '@/lib/strategies/types';

interface ProfileSelectorProps {
  profiles: Array<{
    slug: string;
    name: string;
    weights: Record<string, number>;
  }>;
  strategies: Array<{
    slug: string;
    name: string;
    tagline: string;
    riskLevel: RiskLevel;
    riskLabel: string;
    dailyChangePct: number;
    topHoldings: Array<{ ticker: string; weight: number }>;
  }>;
  labels: {
    profileLabel: string;
    dailyChangeLabel: string;
  };
}

export default function ProfileSelector({
  profiles,
  strategies,
  labels,
}: ProfileSelectorProps) {
  const [selectedProfile, setSelectedProfile] = useState<string>('balanced');
  const [hoveredStrategy, setHoveredStrategy] = useState<string | null>(null);

  const activeProfile = profiles.find((p) => p.slug === selectedProfile);

  const sortedStrategies = [...strategies].sort((a, b) => {
    const weightA = activeProfile?.weights[a.slug] ?? 0;
    const weightB = activeProfile?.weights[b.slug] ?? 0;
    return weightB - weightA;
  });

  const donutSegments = sortedStrategies.map((s) => ({
    slug: s.slug,
    name: s.name,
    weight: activeProfile?.weights[s.slug] ?? 0,
    color: getStrategyColor(s.slug),
  }));

  // Split into left/right columns for desktop donut layout
  const leftStrategies = sortedStrategies.slice(0, 2);
  const rightStrategies = sortedStrategies.slice(2, 4);

  return (
    <div className="w-full">
      {/* Glowing Profile Buttons */}
      <div className="flex justify-center gap-3 mb-10">
        {profiles.map((profile) => (
          <button
            key={profile.slug}
            onClick={() => setSelectedProfile(profile.slug)}
            data-active={selectedProfile === profile.slug}
            className="profile-btn-glow px-6 py-2.5 rounded-full text-sm font-medium text-text-primary transition-all duration-300 cursor-pointer"
          >
            {profile.name}
          </button>
        ))}
      </div>

      {/* Desktop: Cards — Donut — Cards | Mobile: Donut then Cards */}
      <div className="flex flex-col items-center gap-6 lg:hidden">
        {/* Mobile: donut on top */}
        <AllocationDonut
          segments={donutSegments}
          activeSlug={hoveredStrategy}
          onHover={setHoveredStrategy}
        />
        {/* Mobile: legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-2">
          {sortedStrategies.map((s) => (
            <div key={s.slug} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getStrategyColor(s.slug) }}
              />
              {s.name}
            </div>
          ))}
        </div>
        {/* Mobile: cards in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {sortedStrategies.map((strategy) => (
            <div
              key={strategy.slug}
              onMouseEnter={() => setHoveredStrategy(strategy.slug)}
              onMouseLeave={() => setHoveredStrategy(null)}
            >
              <StrategyCard
                slug={strategy.slug}
                name={strategy.name}
                tagline={strategy.tagline}
                riskLevel={strategy.riskLevel}
                riskLabel={strategy.riskLabel}
                weight={activeProfile?.weights[strategy.slug]}

                dailyChangePct={strategy.dailyChangePct}
                topHoldings={strategy.topHoldings}
                dailyChangeLabel={labels.dailyChangeLabel}
                accentColor={getStrategyColor(strategy.slug)}
                isHighlighted={hoveredStrategy === strategy.slug}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: 3-column layout — left cards | donut | right cards */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:items-center">
        {/* Left column — top 2 strategies */}
        <div className="flex flex-col gap-4">
          {leftStrategies.map((strategy) => (
            <div
              key={strategy.slug}
              onMouseEnter={() => setHoveredStrategy(strategy.slug)}
              onMouseLeave={() => setHoveredStrategy(null)}
              className="card-connector card-connector--right"
              style={{ '--connector-color': getStrategyColor(strategy.slug) } as React.CSSProperties}
            >
              <StrategyCard
                slug={strategy.slug}
                name={strategy.name}
                tagline={strategy.tagline}
                riskLevel={strategy.riskLevel}
                riskLabel={strategy.riskLabel}
                weight={activeProfile?.weights[strategy.slug]}

                dailyChangePct={strategy.dailyChangePct}
                topHoldings={strategy.topHoldings}
                dailyChangeLabel={labels.dailyChangeLabel}
                accentColor={getStrategyColor(strategy.slug)}
                isHighlighted={hoveredStrategy === strategy.slug}
              />
            </div>
          ))}
        </div>

        {/* Center — Donut */}
        <div className="flex flex-col items-center gap-4">
          <AllocationDonut
            segments={donutSegments}
            activeSlug={hoveredStrategy}
            onHover={setHoveredStrategy}
          />
          {/* Legend below donut */}
          <div className="flex flex-wrap justify-center gap-3">
            {sortedStrategies.map((s) => (
              <div
                key={s.slug}
                className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                onMouseEnter={() => setHoveredStrategy(s.slug)}
                onMouseLeave={() => setHoveredStrategy(null)}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: getStrategyColor(s.slug) }}
                />
                {s.name}
              </div>
            ))}
          </div>
        </div>

        {/* Right column — bottom 2 strategies */}
        <div className="flex flex-col gap-4">
          {rightStrategies.map((strategy) => (
            <div
              key={strategy.slug}
              onMouseEnter={() => setHoveredStrategy(strategy.slug)}
              onMouseLeave={() => setHoveredStrategy(null)}
              className="card-connector card-connector--left"
              style={{ '--connector-color': getStrategyColor(strategy.slug) } as React.CSSProperties}
            >
              <StrategyCard
                slug={strategy.slug}
                name={strategy.name}
                tagline={strategy.tagline}
                riskLevel={strategy.riskLevel}
                riskLabel={strategy.riskLabel}
                weight={activeProfile?.weights[strategy.slug]}

                dailyChangePct={strategy.dailyChangePct}
                topHoldings={strategy.topHoldings}
                dailyChangeLabel={labels.dailyChangeLabel}
                accentColor={getStrategyColor(strategy.slug)}
                isHighlighted={hoveredStrategy === strategy.slug}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
