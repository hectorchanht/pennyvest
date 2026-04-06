import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllStrategies, getStrategyConfig } from '@/lib/strategies';
import { notFound } from 'next/navigation';
import SwipeNavigator from '@/components/strategy/SwipeNavigator';
import FundHeader from '@/components/strategy/FundHeader';
import PricesSection from '@/components/strategy/PricesSection';
import EquitySection from '@/components/charts/EquitySection';
import NewsFeed from '@/components/news/NewsFeed';
import { AllocationDonutClient } from '@/components/charts/ClientCharts';
import OpportunityCard from '@/components/strategy/OpportunityCard';
import PortfolioNotes from '@/components/strategy/PortfolioNotes';
import {
  mockFundDetails,
  mockOpportunities,
  mockPortfolioNotes,
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

  // Risk label for allocation donut center
  const riskLabel = t(`riskLevel.${strategy.riskLevel}`);

  // Phase 3: translated labels for live data sections
  const newsLabels = {
    sectionTitle: t('news.sectionTitle'),
    loading: t('news.loading'),
    error: t('news.error'),
    retry: t('news.retry'),
    lastUpdated: t('common.lastUpdated', { time: '{time}' }),
    staleWarning: t('common.staleWarning'),
    noArticles: t('news.noArticles'),
    source: t('news.source'),
  };

  const pricesSectionLabels = {
    ticker: t('strategy.holdingsTable.ticker'),
    name: t('strategy.holdingsTable.name'),
    weight: t('strategy.holdingsTable.weight'),
    price: t('common.price'),
    change24h: t('common.change24h'),
    loading: t('charts.loading'),
    error: t('charts.error'),
    retry: t('charts.retry'),
    lastUpdated: t('common.lastUpdated', { time: '{time}' }),
    staleWarning: t('common.staleWarning'),
  };

  const equitySectionLabels = {
    equityTitle: t('charts.equityTitle'),
    simulatedLabel: t('charts.simulatedLabel'),
    error: t('charts.error'),
    retry: t('charts.retry'),
    lastUpdated: t('common.lastUpdated', { time: '{time}' }),
    staleWarning: t('common.staleWarning'),
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

        {/* 2. Allocation Donut Chart -- STRT-02 (static allocation data, ssr:false in ClientCharts) */}
        <section className="mb-8">
          <AllocationDonutClient
            allocations={strategy.allocations.map((a) => ({
              name: a.name,
              ticker: a.ticker,
              weight: a.weight,
            }))}
            centerLabel={riskLabel}
            title={t('charts.allocationTitle')}
          />
        </section>

        {/* 3. Live Holdings with Prices -- STRT-05 */}
        <section className="mb-8">
          <PricesSection
            slug={slug}
            allocations={strategy.allocations.map((a) => ({
              ticker: a.ticker,
              name: a.name,
              weight: a.weight,
            }))}
            labels={pricesSectionLabels}
            staleTtlMs={600000}
          />
        </section>

        {/* 4. Equity Curve -- STRT-06 (ssr:false dynamic import inside EquitySection) */}
        <section className="mb-8">
          <EquitySection
            slug={slug}
            labels={equitySectionLabels}
            staleTtlMs={172800000}
          />
        </section>

        {/* 5. News + AI Analysis -- NEWS-01 through NEWS-04 */}
        <section className="mb-8">
          <NewsFeed slug={slug} locale={locale} labels={newsLabels} />
        </section>

        {/* 6. Investment Opportunities */}
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

        {/* 7. Portfolio Notes */}
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

        {/* 8. Disclaimer */}
        <p className="text-xs text-text-muted text-center py-4 border-t border-border">
          {t('fundDetail.labels.disclaimer')}
        </p>
      </div>
    </SwipeNavigator>
  );
}
