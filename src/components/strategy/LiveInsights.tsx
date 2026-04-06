'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import OpportunityCard from './OpportunityCard';
import PortfolioNotes from './PortfolioNotes';
import type { OpportunityData, PortfolioNotesData } from '@/lib/data/insights';

interface LiveInsightsProps {
  slug: string;
  locale: string;
  labels: {
    opportunitiesTitle: string;
    opportunitiesSubtitle: string;
    notesTitle: string;
    notesSubtitle: string;
    confidence: string;
    horizon: string;
    logic: string;
    catalysts: string;
    risks: string;
    riskManagement: string;
    cashStrategy: string;
    actionHold: string;
    actionAdd: string;
    actionReduce: string;
    loading: string;
    error: string;
  };
}

interface InsightsResponse {
  data: {
    opportunities: OpportunityData[];
    portfolioNotes: PortfolioNotesData;
  };
  cachedAt: number;
}

export default function LiveInsights({ slug, locale, labels }: LiveInsightsProps) {
  const [data, setData] = useState<InsightsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/insights/${slug}?locale=${locale}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<InsightsResponse>;
      })
      .then((json) => {
        setData(json.data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, locale]);

  const oppLabels = {
    confidence: labels.confidence,
    horizon: labels.horizon,
    logic: labels.logic,
    catalysts: labels.catalysts,
    risks: labels.risks,
    actionHold: labels.actionHold,
    actionAdd: labels.actionAdd,
    actionReduce: labels.actionReduce,
  };

  const notesLabels = {
    title: labels.notesTitle,
    subtitle: labels.notesSubtitle,
    riskManagement: labels.riskManagement,
    cashStrategy: labels.cashStrategy,
    actionHold: labels.actionHold,
    actionAdd: labels.actionAdd,
    actionReduce: labels.actionReduce,
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <section className="mb-8">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </section>
        <section className="mb-8">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </section>
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-text-muted text-center py-8">
        {labels.error}
      </p>
    );
  }

  return (
    <>
      {/* Opportunities */}
      {data.opportunities.length > 0 && (
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-text-primary">
              {labels.opportunitiesTitle}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {labels.opportunitiesSubtitle}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {data.opportunities.map((opp, i) => (
              <OpportunityCard key={i} data={opp} labels={oppLabels} />
            ))}
          </div>
        </section>
      )}

      {/* Portfolio Notes */}
      {data.portfolioNotes && (
        <PortfolioNotes
          actionSummary={data.portfolioNotes.actionSummary}
          description={data.portfolioNotes.description}
          holdingAdjustments={data.portfolioNotes.holdingAdjustments}
          riskNote={data.portfolioNotes.riskNote}
          cashNote={data.portfolioNotes.cashNote}
          labels={notesLabels}
        />
      )}
    </>
  );
}
