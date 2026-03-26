'use client';

import NewsCard from './NewsCard';

interface NewsDigestProps {
  title: string;
  newsItems: Array<{
    id: string;
    headline: string;
    category: string;
    categorySlug: string;
    source: string;
    date: string;
    impactScore: number;
    summary: string;
    shortTermImpact: string;
    midTermImpact: string;
    relatedHoldings: string[];
  }>;
  labels: {
    impactLabel: string;
    shortTermLabel: string;
    midTermLabel: string;
    relatedLabel: string;
  };
}

export default function NewsDigest({ title, newsItems, labels }: NewsDigestProps) {
  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold text-text-primary mb-6">{title}</h2>
      <div className="space-y-4">
        {newsItems.map((item) => (
          <NewsCard
            key={item.id}
            headline={item.headline}
            category={item.category}
            categorySlug={item.categorySlug}
            source={item.source}
            date={item.date}
            impactScore={item.impactScore}
            summary={item.summary}
            shortTermImpact={item.shortTermImpact}
            midTermImpact={item.midTermImpact}
            relatedHoldings={item.relatedHoldings}
            labels={labels}
          />
        ))}
      </div>
    </section>
  );
}
