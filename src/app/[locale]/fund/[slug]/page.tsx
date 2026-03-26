import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllStrategies, getStrategyConfig } from '@/lib/strategies';
import { notFound } from 'next/navigation';
import SwipeNavigator from '@/components/strategy/SwipeNavigator';
import FundHeader from '@/components/strategy/FundHeader';
import EnhancedHoldingsTable from '@/components/strategy/EnhancedHoldingsTable';
import FundNewsSection from '@/components/strategy/FundNewsSection';
import OpportunityCard from '@/components/strategy/OpportunityCard';
import PortfolioNotes from '@/components/strategy/PortfolioNotes';
import {
  mockFundDetails,
  mockOpportunities,
  mockPortfolioNotes,
  mockNewsItems,
} from '@/lib/mock-data';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return getAllStrategies().map((s) => ({ slug: s.slug }));
}

export default async function FundPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const strategy = getStrategyConfig(slug);
  if (!strategy) notFound();

  const t = await getTranslations();
  const allStrategies = getAllStrategies();

  // Determine prev/next slugs for swipe navigation
  const currentIndex = allStrategies.findIndex((s) => s.slug === slug);
  const prevStrategy = currentIndex > 0 ? allStrategies[currentIndex - 1] : undefined;
  const nextStrategy =
    currentIndex < allStrategies.length - 1 ? allStrategies[currentIndex + 1] : undefined;
  const prevSlug = prevStrategy?.slug ?? null;
  const nextSlug = nextStrategy?.slug ?? null;

  const fundName = t(strategy.nameKey);
  const fundDetail = mockFundDetails[slug];
  const opportunities = mockOpportunities[slug] ?? [];
  const portfolioNotes = mockPortfolioNotes[slug];

  // Filter news to this strategy
  const strategyNews = mockNewsItems.filter((item) =>
    item.relatedStrategies.includes(slug),
  );

  // Build stats for header
  const dailyGainPct = fundDetail?.dailyGainPct ?? 0;
  const cashRatio = fundDetail?.cashRatio ?? 2;
  const sixMonthTargetPct = fundDetail?.sixMonthTargetPct ?? 0;
  const annualizedReturnPct = fundDetail?.annualizedReturnPct ?? 0;

  const stats = [
    {
      label: t('fundDetail.labels.dailyGain'),
      value: `${dailyGainPct >= 0 ? '+' : ''}${dailyGainPct.toFixed(2)}%`,
      isPositive: dailyGainPct > 0,
      isNegative: dailyGainPct < 0,
    },
    {
      label: t('fundDetail.labels.cashRatio'),
      value: `${cashRatio.toFixed(1)}%`,
    },
    {
      label: t('fundDetail.labels.sixMonthTarget'),
      value: `+${sixMonthTargetPct}%`,
      isPositive: true,
    },
    {
      label: t('fundDetail.labels.annualizedReturn'),
      value: `+${annualizedReturnPct}%`,
      isPositive: true,
    },
  ];

  // Build enhanced allocations (merge strategy allocations with daily change data)
  const holdingDetailsMap = new Map(
    (fundDetail?.holdingDetails ?? []).map((h) => [h.ticker, h.dailyChangePct]),
  );
  const enhancedAllocations = strategy.allocations.map((a) => ({
    ticker: a.ticker,
    weight: a.weight,
    dailyChangePct: holdingDetailsMap.get(a.ticker) ?? 0,
  }));

  // Translate news items
  const newsTranslations = strategyNews.map((item) => ({
    headline: t(item.headlineKey),
    summary: t(item.summaryKey),
    shortTermImpact: t(item.shortTermImpactKey),
    midTermImpact: t(item.midTermImpactKey),
    category: t(`newsDigest.categories.${item.category}`),
  }));

  // Translate opportunities
  const translatedOpportunities = opportunities.map((opp) => ({
    title: t(opp.titleKey),
    description: t(opp.descriptionKey),
    confidence: opp.confidence,
    horizon: t(opp.horizonKey),
    logic: t(opp.logicKey),
    catalysts: opp.catalystKeys.map((k) => t(k)),
    risks: opp.riskKeys.map((k) => t(k)),
    actions: opp.actions,
  }));

  // Translate portfolio notes
  const translatedNotes = portfolioNotes
    ? {
        actionSummary: t(portfolioNotes.actionSummaryKey),
        description: t(portfolioNotes.descriptionKey),
        holdingAdjustments: portfolioNotes.holdingAdjustments.map((adj) => ({
          ticker: adj.ticker,
          action: adj.action,
          reasoning: t(adj.reasoningKey),
        })),
        riskNote: t(portfolioNotes.riskNoteKey),
        cashNote: t(portfolioNotes.cashNoteKey),
      }
    : null;

  const opportunityLabels = {
    confidence: t('fundDetail.labels.confidence'),
    horizon: t('fundDetail.labels.horizon'),
    logic: t('fundDetail.labels.logic'),
    catalysts: t('fundDetail.labels.catalysts'),
    risks: t('fundDetail.labels.risks'),
    actionHold: t('fundDetail.labels.actionHold'),
    actionAdd: t('fundDetail.labels.actionAdd'),
    actionReduce: t('fundDetail.labels.actionReduce'),
  };

  return (
    <SwipeNavigator prevSlug={prevSlug} nextSlug={nextSlug}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 1. Fund Header Banner */}
        <FundHeader
          fundName={fundName}
          date="2026-03-27"
          stats={stats}
          labels={{
            trackingLive: t('fundDetail.labels.trackingLive'),
            modelPortfolio: t('fundDetail.labels.modelPortfolio'),
          }}
        />

        {/* 2. Enhanced Holdings Table */}
        <EnhancedHoldingsTable
          allocations={enhancedAllocations}
          portfolioValue={fundDetail?.portfolioValue ?? 1_000_000}
          cashRatio={cashRatio}
          labels={{
            ticker: t('fundDetail.labels.ticker'),
            allocation: t('fundDetail.labels.allocation'),
            marketValue: t('fundDetail.labels.marketValue'),
            dailyChangePct: t('fundDetail.labels.dailyChangePct'),
            dailyChangeAmt: t('fundDetail.labels.dailyChangeAmt'),
            cash: t('fundDetail.labels.cash'),
          }}
        />

        {/* 3. News Section */}
        {strategyNews.length > 0 && (
          <FundNewsSection
            newsItems={strategyNews}
            translations={newsTranslations}
            labels={{
              title: t('fundDetail.labels.newsTitle'),
              subtitle: t('fundDetail.labels.newsSubtitle'),
              impactLabel: t('newsDigest.impactLabel'),
              shortTermLabel: t('newsDigest.shortTermLabel'),
              midTermLabel: t('newsDigest.midTermLabel'),
              relatedLabel: t('newsDigest.relatedLabel'),
              categories: {
                geopolitics: t('newsDigest.categories.geopolitics'),
                ai: t('newsDigest.categories.ai'),
                semiconductor: t('newsDigest.categories.semiconductor'),
                commodities: t('newsDigest.categories.commodities'),
                crypto: t('newsDigest.categories.crypto'),
                macro: t('newsDigest.categories.macro'),
              },
            }}
          />
        )}

        {/* 4. Investment Opportunities */}
        {translatedOpportunities.length > 0 && (
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-text-primary">
                {t('fundDetail.labels.opportunitiesTitle')}
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                {t('fundDetail.labels.opportunitiesSubtitle')}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {translatedOpportunities.map((opp, i) => (
                <OpportunityCard
                  key={opportunities[i]?.id ?? i}
                  data={opp}
                  labels={opportunityLabels}
                />
              ))}
            </div>
          </section>
        )}

        {/* 5. Portfolio Notes */}
        {translatedNotes && (
          <PortfolioNotes
            actionSummary={translatedNotes.actionSummary}
            description={translatedNotes.description}
            holdingAdjustments={translatedNotes.holdingAdjustments}
            riskNote={translatedNotes.riskNote}
            cashNote={translatedNotes.cashNote}
            labels={{
              title: t('fundDetail.labels.notesTitle'),
              subtitle: t('fundDetail.labels.notesSubtitle'),
              riskManagement: t('fundDetail.labels.riskManagement'),
              cashStrategy: t('fundDetail.labels.cashStrategy'),
              actionHold: t('fundDetail.labels.actionHold'),
              actionAdd: t('fundDetail.labels.actionAdd'),
              actionReduce: t('fundDetail.labels.actionReduce'),
            }}
          />
        )}

        {/* 6. Disclaimer */}
        <p className="text-xs text-text-muted text-center py-4 border-t border-border">
          {t('fundDetail.labels.disclaimer')}
        </p>
      </div>
    </SwipeNavigator>
  );
}
