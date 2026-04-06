'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { NewsArticle, NewsResponse } from '@/types/news';

interface NewsFeedProps {
  slug: string;
  locale: string;
  labels: {
    sectionTitle: string;
    loading: string;
    error: string;
    retry: string;
    lastUpdated: string;
    staleWarning: string;
    noArticles: string;
    source: string;
  };
}

const STALE_TTL_MS = 600_000; // 10 minutes

function getRelativeTime(ts: number): string {
  const diffMs = Date.now() - ts;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr} hr ago`;
}

function parsePublishedAt(publishedAt: string): string {
  const ts = new Date(publishedAt).getTime();
  if (isNaN(ts)) return publishedAt;
  return getRelativeTime(ts);
}

export default function NewsFeed({ slug, locale, labels }: NewsFeedProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [cachedAt, setCachedAt] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/news/${slug}?locale=${locale}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as NewsResponse;
      setArticles(json.articles ?? []);
      setCachedAt(json.cachedAt ?? Date.now());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [slug, locale]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <section>
      <h3 className="text-sm font-medium text-text-primary mb-3">{labels.sectionTitle}</h3>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <Card className="border-destructive">
          <CardContent className="py-4">
            <p className="text-sm text-text-secondary mb-3">{labels.error}</p>
            <button
              onClick={fetchNews}
              className="text-sm text-primary underline hover:no-underline"
            >
              {labels.retry}
            </button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && articles.length === 0 && (
        <p className="text-sm text-text-muted">{labels.noArticles}</p>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="space-y-4">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-text-primary"
                  >
                    {article.headline}
                  </a>
                </CardTitle>
                <p className="text-xs text-text-muted mt-1">
                  {labels.source}: {article.source} &middot; {parsePublishedAt(article.publishedAt)}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">{article.summary}</p>
                {article.relatedTickers.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {article.relatedTickers.map((ticker) => (
                      <Badge key={ticker} variant="outline" className="text-xs">
                        {ticker}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center gap-3 mt-2">
            {cachedAt > 0 && (
              <p className="text-xs text-text-muted">
                {labels.lastUpdated.replace('{time}', getRelativeTime(cachedAt))}
              </p>
            )}
            {cachedAt > 0 && Date.now() - cachedAt > STALE_TTL_MS && (
              <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                {labels.staleWarning}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
