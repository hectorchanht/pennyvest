import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border pb-20 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-text-muted">{t('tagline')}</p>
        <p className="text-xs text-text-muted">
          {t('copyright', { year })}
        </p>
      </div>
    </footer>
  );
}
