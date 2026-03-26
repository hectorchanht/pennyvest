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
    weightLabel: string;
    dailyChangeLabel: string;
  };
}

export default function HeroSection({ profiles, strategies, labels }: HeroSectionProps) {
  return (
    <section className="pt-24 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            {labels.tagline}
          </h1>
          <p className="text-base text-text-secondary mt-2">
            {labels.subtagline}
          </p>
        </div>
        <ProfileSelector
          profiles={profiles}
          strategies={strategies}
          labels={{
            profileLabel: labels.profileLabel,
            weightLabel: labels.weightLabel,
            dailyChangeLabel: labels.dailyChangeLabel,
          }}
        />
      </div>
    </section>
  );
}
