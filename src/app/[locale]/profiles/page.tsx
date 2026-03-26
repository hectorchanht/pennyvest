import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllProfiles } from '@/lib/strategies/profiles';
import { getAllStrategies } from '@/lib/strategies';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const profiles = getAllProfiles();
  const strategies = getAllStrategies();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('profiles.title')}</h1>
      <p className="text-text-secondary mb-8">{t('profiles.subtitle')}</p>

      <div className="space-y-8">
        {profiles.map((profile) => (
          <section key={profile.slug} className="bg-surface rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-2">{t(`profiles.${profile.slug}.name`)}</h2>
            <p className="text-text-secondary mb-4">{t(`profiles.${profile.slug}.description`)}</p>

            {/* Fund weight breakdown */}
            <div className="space-y-2">
              {Object.entries(profile.weights)
                .sort(([, a], [, b]) => b - a)
                .map(([fundSlug, weight]) => {
                  const strategy = strategies.find((s) => s.slug === fundSlug);
                  if (!strategy) return null;
                  const fundName = t(strategy.nameKey);
                  return (
                    <div key={fundSlug} className="flex items-center justify-between">
                      <Link
                        href={`/fund/${fundSlug}`}
                        className="text-brand-green hover:text-brand-green-light text-sm"
                      >
                        {fundName}
                      </Link>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-surface-hover rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-green rounded-full"
                            style={{ width: `${Math.round(weight * 100)}%` }}
                          />
                        </div>
                        <span className="text-text-secondary text-sm font-mono w-10 text-right">
                          {Math.round(weight * 100)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
