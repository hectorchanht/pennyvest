import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllStrategies, getStrategyConfig } from '@/lib/strategies';
import { notFound } from 'next/navigation';
import LiveFundHeader from '@/components/strategy/LiveFundHeader';
import PricesSection from '@/components/strategy/PricesSection';
import EquitySection from '@/components/charts/EquitySection';
import NewsFeed from '@/components/news/NewsFeed';
import AllocationDonut from '@/components/landing/AllocationDonut';
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

  // Build donut segments from strategy allocations
  const HOLDING_COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa'];
  const donutSegments = strategy.allocations.map((a, i) => ({
    slug: a.ticker.toLowerCase(),
    name: a.name,
    weight: a.weight,
    color: HOLDING_COLORS[i % HOLDING_COLORS.length]!,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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

      {/* Allocation Donut */}
      <section className="mb-8 flex flex-col items-center">
        <h3 className="text-sm font-medium text-text-primary mb-3 self-start">
          {t('charts.allocationTitle')}
        </h3>
        <AllocationDonut segments={donutSegments} />
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {strategy.allocations.map((a, i) => (
            <div key={a.ticker} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: HOLDING_COLORS[i % HOLDING_COLORS.length] }}
              />
              {a.ticker} {Math.round(a.weight * 100)}%
            </div>
          ))}
        </div>
      </section>

      {/* Live Holdings with Prices */}
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

      {/* Equity Curve */}
      <section className="mb-8">
        <EquitySection
          slug={slug}
          labels={equitySectionLabels}
          staleTtlMs={172800000}
        />
      </section>

      {/* News */}
      <section className="mb-8">
        <NewsFeed slug={slug} locale={locale} labels={newsLabels} />
      </section>

      {/* AI-Generated Opportunities + Portfolio Notes */}
      <LiveInsights slug={slug} locale={locale} labels={insightsLabels} />

      {/* Disclaimer */}
      <p className="text-xs text-text-muted text-center py-4 border-t border-border">
        {t('fundDetail.labels.disclaimer')}
      </p>
    </div>
  );
}
