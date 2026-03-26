import NewsCard from '@/components/landing/NewsCard';
import type { MockNewsItem } from '@/lib/mock-data';

interface FundNewsSectionProps {
  newsItems: MockNewsItem[];
  translations: {
    headline: string;
    summary: string;
    shortTermImpact: string;
    midTermImpact: string;
    category: string;
  }[];
  labels: {
    title: string;
    subtitle: string;
    impactLabel: string;
    shortTermLabel: string;
    midTermLabel: string;
    relatedLabel: string;
    categories: Record<string, string>;
  };
}

export default function FundNewsSection({
  newsItems,
  translations,
  labels,
}: FundNewsSectionProps) {
  if (newsItems.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-text-primary">{labels.title}</h2>
        <p className="text-sm text-text-secondary mt-1">{labels.subtitle}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((item, index) => {
          const tr = translations[index];
          if (!tr) return null;
          return (
            <NewsCard
              key={item.id}
              headline={tr.headline}
              category={tr.category}
              categorySlug={item.category}
              source={item.source}
              date={item.date}
              impactScore={item.impactScore}
              summary={tr.summary}
              shortTermImpact={tr.shortTermImpact}
              midTermImpact={tr.midTermImpact}
              relatedHoldings={item.relatedHoldings}
              labels={{
                impactLabel: labels.impactLabel,
                shortTermLabel: labels.shortTermLabel,
                midTermLabel: labels.midTermLabel,
                relatedLabel: labels.relatedLabel,
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
