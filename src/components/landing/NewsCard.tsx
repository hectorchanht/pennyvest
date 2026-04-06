import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NewsCardProps {
  headline: string;
  summary: string;
  source: string;
  date: string;
  url: string;
  category: string;
  relatedTickers: string[];
  labels: {
    relatedLabel: string;
  };
}

const categoryColors: Record<string, string> = {
  general: 'bg-emerald-500/20 text-emerald-400',
  forex: 'bg-blue-500/20 text-blue-400',
  crypto: 'bg-cyan-500/20 text-cyan-400',
  merger: 'bg-violet-500/20 text-violet-400',
  company: 'bg-amber-500/20 text-amber-400',
};

function formatCategory(cat: string): string {
  if (!cat) return 'Market';
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

export default function NewsCard({
  headline,
  summary,
  source,
  date,
  url,
  category,
  relatedTickers,
  labels,
}: NewsCardProps) {
  const colorClass = categoryColors[category] ?? 'bg-gray-500/20 text-gray-400';

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge className={colorClass}>{formatCategory(category)}</Badge>
        </div>
        <h3 className="text-base font-semibold text-text-primary mt-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {headline}
          </a>
        </h3>
        <p className="text-xs text-text-secondary">
          {source} &middot; {date}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {summary && (
          <p className="text-sm text-text-secondary line-clamp-3">{summary}</p>
        )}
        {relatedTickers.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-text-secondary">{labels.relatedLabel}:</span>
            {relatedTickers.map((ticker) => (
              <Badge key={ticker} variant="outline" className="text-xs">
                {ticker}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
