import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllStrategies, getStrategyConfig } from '@/lib/strategies';
import { notFound } from 'next/navigation';
import HoldingsTable from '@/components/strategy/HoldingsTable';
import AllocationSidebar from '@/components/strategy/AllocationSidebar';
import ComingSoonCard from '@/components/strategy/ComingSoonCard';
import SwipeNavigator from '@/components/strategy/SwipeNavigator';

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
  const nextStrategy = currentIndex < allStrategies.length - 1 ? allStrategies[currentIndex + 1] : undefined;
  const prevSlug = prevStrategy?.slug ?? null;
  const nextSlug = nextStrategy?.slug ?? null;

  const fundName = t(strategy.nameKey);
  const rationale = t(strategy.rationaleKey);
  const riskLabel = t(`riskLevel.${strategy.riskLevel}`);

  return (
    <SwipeNavigator prevSlug={prevSlug} nextSlug={nextSlug}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{fundName}</h1>

        {/* Two-column layout: main content left, sidebar right (per D-06) */}
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Left column: main content */}
          <div className="flex-1 min-w-0">
            {/* Rationale section (per D-16, STRT-03) */}
            <section className="mb-8">
              <p className="text-text-secondary text-lg leading-relaxed">{rationale}</p>
            </section>

            {/* Holdings table (per D-17) */}
            <section className="mb-8">
              <HoldingsTable
                allocations={strategy.allocations.map((a) => ({
                  ticker: a.ticker,
                  name: a.name,
                  weight: a.weight,
                }))}
                labels={{
                  ticker: t('strategy.holdingsTable.ticker'),
                  name: t('strategy.holdingsTable.name'),
                  weight: t('strategy.holdingsTable.weight'),
                }}
              />
            </section>

            {/* Phase 3 placeholder sections (per D-08) */}
            <section className="space-y-4">
              <ComingSoonCard
                title={t('strategy.comingSoon.charts')}
                label={t('strategy.comingSoon.label')}
              />
              <ComingSoonCard
                title={t('strategy.comingSoon.prices')}
                label={t('strategy.comingSoon.label')}
              />
              <ComingSoonCard
                title={t('strategy.comingSoon.news')}
                label={t('strategy.comingSoon.label')}
              />
            </section>
          </div>

          {/* Right column: sticky sidebar (per D-06, D-10) */}
          <aside className="w-full lg:w-72 shrink-0">
            <AllocationSidebar
              riskLevel={strategy.riskLevel}
              riskLabel={riskLabel}
              allocations={strategy.allocations.map((a) => ({
                ticker: a.ticker,
                name: a.name,
                weight: a.weight,
              }))}
              labels={{
                allocationTitle: t('strategy.sidebar.allocationTitle'),
                profilesLink: t('strategy.sidebar.profilesLink'),
              }}
            />
          </aside>
        </div>
      </div>
    </SwipeNavigator>
  );
}
