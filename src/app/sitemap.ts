import type { MetadataRoute } from 'next';

const BASE_URL = 'https://pennyvest.space';
const FUND_SLUGS = ['future-tech', 'traditional', 'commodities', 'crypto'];
const LOCALES = ['en', 'zh'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    });
    for (const page of ['profiles', 'questionnaire']) {
      entries.push({
        url: `${BASE_URL}/${locale}/${page}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
    for (const slug of FUND_SLUGS) {
      entries.push({
        url: `${BASE_URL}/${locale}/fund/${slug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }

  return entries;
}
