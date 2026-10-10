import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import MobileTabBar from '@/components/layout/MobileTabBar';
import Footer from '@/components/layout/Footer';
import PostHogProvider from '@/components/analytics/PostHogProvider';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = 'https://pennyvest.space';
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale === 'zh-HK' ? 'zh' : 'en'}`,
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: 'Pennyvest',
      locale: locale === 'zh-HK' ? 'zh_HK' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <PostHogProvider locale={locale}>
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
        <MobileTabBar />
      </PostHogProvider>
    </NextIntlClientProvider>
  );
}
