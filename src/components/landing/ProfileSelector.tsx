'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import StrategyCard from './StrategyCard';
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
    weightLabel: string;
    dailyChangeLabel: string;
  };
}

export default function ProfileSelector({
  profiles,
  strategies,
  labels,
}: ProfileSelectorProps) {
  const [selectedProfile, setSelectedProfile] = useState<string>('balanced');

  const activeProfile = profiles.find((p) => p.slug === selectedProfile);

  const sortedStrategies = [...strategies].sort((a, b) => {
    const weightA = activeProfile?.weights[a.slug] ?? 0;
    const weightB = activeProfile?.weights[b.slug] ?? 0;
    return weightB - weightA;
  });

  return (
    <div className="w-full">
      <p className="text-text-secondary text-sm mb-4 text-center">
        {labels.profileLabel}
      </p>
      <Tabs value={selectedProfile} onValueChange={setSelectedProfile}>
        <div className="flex justify-center mb-6">
          <TabsList>
            {profiles.map((profile) => (
              <TabsTrigger key={profile.slug} value={profile.slug}>
                {profile.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {profiles.map((profile) => (
          <TabsContent key={profile.slug} value={profile.slug}>
            <div
              id="strategies"
              className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
            >
              {sortedStrategies.map((strategy) => (
                <StrategyCard
                  key={strategy.slug}
                  slug={strategy.slug}
                  name={strategy.name}
                  tagline={strategy.tagline}
                  riskLevel={strategy.riskLevel}
                  riskLabel={strategy.riskLabel}
                  weight={profile.weights[strategy.slug]}
                  weightLabel={labels.weightLabel}
                  dailyChangePct={strategy.dailyChangePct}
                  topHoldings={strategy.topHoldings}
                  dailyChangeLabel={labels.dailyChangeLabel}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
