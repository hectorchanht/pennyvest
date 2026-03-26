import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllStrategies } from '@/lib/strategies';
import { getAllProfiles } from '@/lib/strategies/profiles';
import HeroSection from '@/components/landing/HeroSection';

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
    })),
    labels: {
      tagline: t('landing.hero.tagline'),
      subtagline: t('landing.hero.subtagline'),
      cta: t('landing.hero.cta'),
      profileLabel: t('landing.profileSelector.label'),
      weightLabel: t('landing.profileSelector.weightLabel'),
    },
  };

  return (
    <div className="-mt-16">
      <HeroSection {...heroProps} />
    </div>
  );
}
