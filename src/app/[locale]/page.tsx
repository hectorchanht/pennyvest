import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllStrategies } from '@/lib/strategies';
import { getAllProfiles } from '@/lib/strategies/profiles';
import { mockNewsItems, mockStrategyData } from '@/lib/mock-data';
import HeroSection from '@/components/landing/HeroSection';
import NewsDigest from '@/components/landing/NewsDigest';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const strategies = getAllStrategies();
  const profiles = getAllProfiles();

  const heroProps = {
    profiles: profiles.map((p) => ({
      slug: p.slug,
      name: t(p.nameKey),
      weights: p.weights,
    })),
    strategies: strategies.map((s) => ({
      slug: s.slug,
      name: t(s.nameKey),
      tagline: t(s.nameKey.replace('.name', '.tagline')),
      riskLevel: s.riskLevel,
      riskLabel: t(`riskLevel.${s.riskLevel}`),
      dailyChangePct: mockStrategyData[s.slug]?.dailyChangePct ?? 0,
      topHoldings: mockStrategyData[s.slug]?.topHoldings ?? [],
    })),
    labels: {
      tagline: t('landing.hero.tagline'),
      subtagline: t('landing.hero.subtagline'),
      profileLabel: t('landing.profileSelector.label'),
      dailyChangeLabel: t('landing.dailyChange'),
    },
  };

  const newsDigestProps = {
    title: t('newsDigest.title'),
    newsItems: mockNewsItems.map((item) => ({
      id: item.id,
      headline: t(item.headlineKey),
      category: t(`newsDigest.categories.${item.category}`),
      categorySlug: item.category,
      source: item.source,
      date: item.date,
      impactScore: item.impactScore,
      summary: t(item.summaryKey),
      shortTermImpact: t(item.shortTermImpactKey),
      midTermImpact: t(item.midTermImpactKey),
      relatedHoldings: item.relatedHoldings,
    })),
    labels: {
      impactLabel: t('newsDigest.impactLabel'),
      shortTermLabel: t('newsDigest.shortTermLabel'),
      midTermLabel: t('newsDigest.midTermLabel'),
      relatedLabel: t('newsDigest.relatedLabel'),
    },
  };

  return (
    <div className="-mt-16">
      <HeroSection {...heroProps} />
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <NewsDigest {...newsDigestProps} />
      </div>
    </div>
  );
}
