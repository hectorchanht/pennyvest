import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllStrategies } from '@/lib/strategies';
import { getAllProfiles } from '@/lib/strategies/profiles';
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
      dailyChangePct: 0, // placeholder — replaced by live data in HeroSection
      topHoldings: s.allocations
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3)
        .map((a) => ({ ticker: a.ticker, weight: a.weight })),
    })),
    labels: {
      tagline: t('landing.hero.tagline'),
      subtagline: t('landing.hero.subtagline'),
      profileLabel: t('landing.profileSelector.label'),
      dailyChangeLabel: t('landing.dailyChange'),
    },
  };

  return (
    <div className="-mt-16">
      <HeroSection {...heroProps} />
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <NewsDigest
          title={t('newsDigest.title')}
          labels={{
            relatedLabel: t('newsDigest.relatedLabel'),
            loading: t('news.loading'),
            error: t('news.error'),
          }}
        />
      </div>
    </div>
  );
}
