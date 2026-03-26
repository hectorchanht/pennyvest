'use client';

import { Button } from '@/components/ui/button';
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
  }>;
  labels: {
    tagline: string;
    subtagline: string;
    cta: string;
    profileLabel: string;
    weightLabel: string;
  };
}

export default function HeroSection({ profiles, strategies, labels }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-text-primary">
          {labels.tagline}
        </h1>
        <p className="text-lg md:text-xl text-text-secondary mt-4">
          {labels.subtagline}
        </p>
        <a href="#strategies" className="mt-8 inline-block">
          <Button
            size="lg"
            className="bg-brand-green hover:bg-brand-green-dark text-background"
          >
            {labels.cta}
          </Button>
        </a>
      </div>
      <div className="w-full max-w-4xl">
        <ProfileSelector
          profiles={profiles}
          strategies={strategies}
          labels={{
            profileLabel: labels.profileLabel,
            weightLabel: labels.weightLabel,
          }}
        />
      </div>
    </section>
  );
}
