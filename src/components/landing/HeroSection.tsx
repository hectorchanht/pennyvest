'use client';

import ProfileSelector from './ProfileSelector';
import type { RiskLevel } from '@/lib/strategies/types';

interface HeroSectionProps {
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
    tagline: string;
    subtagline: string;
    profileLabel: string;
    dailyChangeLabel: string;
  };
}

export default function HeroSection({ profiles, strategies, labels }: HeroSectionProps) {
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
          strategies={strategies}
          labels={{
            profileLabel: labels.profileLabel,
            dailyChangeLabel: labels.dailyChangeLabel,
          }}
        />
      </div>
    </section>
  );
}
