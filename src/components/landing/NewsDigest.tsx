'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import NewsCard from './NewsCard';
import type { NewsArticle, NewsResponse } from '@/types/news';

interface NewsDigestProps {
  title: string;
  labels: {
    relatedLabel: string;
    loading: string;
    error: string;
  };
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function NewsDigest({ title, labels }: NewsDigestProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/news/market')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<NewsResponse>;
      })
      .then((data) => {
        setArticles(data.articles ?? []);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold text-text-primary mb-6">{title}</h2>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-4 space-y-3">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-text-muted">{labels.error}</p>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="space-y-4">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              headline={article.headline}
              summary={article.summary}
              source={article.source}
              date={formatDate(article.publishedAt)}
              url={article.url}
              category={article.category}
              relatedTickers={article.relatedTickers}
              labels={{ relatedLabel: labels.relatedLabel }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
