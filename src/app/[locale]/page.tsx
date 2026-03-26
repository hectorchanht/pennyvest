import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('strategies');

  return (
    <main>
      <h1>{t('futureTech.name')}</h1>
      <p>{t('futureTech.tagline')}</p>
      <ul>
        <li>{t('futureTech.name')}</li>
        <li>{t('traditional.name')}</li>
        <li>{t('commodities.name')}</li>
        <li>{t('crypto.name')}</li>
      </ul>
    </main>
  );
}
