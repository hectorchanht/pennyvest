import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllStrategies, getStrategyConfig } from '@/lib/strategies';
import { notFound } from 'next/navigation';
import SwipeNavigator from '@/components/strategy/SwipeNavigator';
import LiveFundHeader from '@/components/strategy/LiveFundHeader';
import PricesSection from '@/components/strategy/PricesSection';
import EquitySection from '@/components/charts/EquitySection';
import NewsFeed from '@/components/news/NewsFeed';
import { AllocationDonutClient } from '@/components/charts/ClientCharts';
import LiveInsights from '@/components/strategy/LiveInsights';

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

  const insightsLabels = {
    opportunitiesTitle: t('fundDetail.labels.opportunitiesTitle'),
    opportunitiesSubtitle: t('fundDetail.labels.opportunitiesSubtitle'),
    notesTitle: t('fundDetail.labels.notesTitle'),
    notesSubtitle: t('fundDetail.labels.notesSubtitle'),
    confidence: t('fundDetail.labels.confidence'),
    horizon: t('fundDetail.labels.horizon'),
    logic: t('fundDetail.labels.logic'),
    catalysts: t('fundDetail.labels.catalysts'),
    risks: t('fundDetail.labels.risks'),
    riskManagement: t('fundDetail.labels.riskManagement'),
    cashStrategy: t('fundDetail.labels.cashStrategy'),
    actionHold: t('fundDetail.labels.actionHold'),
    actionAdd: t('fundDetail.labels.actionAdd'),
    actionReduce: t('fundDetail.labels.actionReduce'),
    loading: t('charts.loading'),
    error: t('charts.error'),
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
        <LiveFundHeader
          slug={slug}
          fundName={fundName}
          labels={{
            trackingLive: t('fundDetail.labels.trackingLive'),
            modelPortfolio: t('fundDetail.labels.modelPortfolio'),
            dailyGain: t('fundDetail.labels.dailyGain'),
            portfolioValue: t('fundDetail.labels.portfolioValue'),
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

        {/* 6. AI-Generated Opportunities + Portfolio Notes */}
        <LiveInsights slug={slug} locale={locale} labels={insightsLabels} />

        {/* 8. Disclaimer */}
        <p className="text-xs text-text-muted text-center py-4 border-t border-border">
          {t('fundDetail.labels.disclaimer')}
        </p>
      </div>
    </SwipeNavigator>
  );
}
