import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NewsCardProps {
  headline: string;
  category: string;        // Already translated category label
  categorySlug: string;    // Raw category for color mapping
  source: string;
  date: string;
  impactScore: number;
  summary: string;
  shortTermImpact: string;
  midTermImpact: string;
  relatedHoldings: string[];
  labels: {
    impactLabel: string;
    shortTermLabel: string;
    midTermLabel: string;
    relatedLabel: string;
  };
}

const categoryColors: Record<string, string> = {
  geopolitics: 'bg-rose-500/20 text-rose-400',
  ai: 'bg-violet-500/20 text-violet-400',
  semiconductor: 'bg-blue-500/20 text-blue-400',
  commodities: 'bg-amber-500/20 text-amber-400',
  crypto: 'bg-cyan-500/20 text-cyan-400',
  macro: 'bg-emerald-500/20 text-emerald-400',
};

function getImpactScoreColor(score: number): string {
  if (score >= 9) return 'bg-red-500/20 text-red-400';
  if (score >= 7) return 'bg-amber-500/20 text-amber-400';
  if (score >= 5) return 'bg-yellow-500/20 text-yellow-400';
  return 'bg-green-500/20 text-green-400';
}

export default function NewsCard({
  headline,
  category,
  categorySlug,
  source,
  date,
  impactScore,
  summary,
  shortTermImpact,
  midTermImpact,
  relatedHoldings,
  labels,
}: NewsCardProps) {
  const categoryColorClass = categoryColors[categorySlug] ?? 'bg-gray-500/20 text-gray-400';
  const impactColorClass = getImpactScoreColor(impactScore);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge className={categoryColorClass}>{category}</Badge>
          <Badge className={impactColorClass}>
            {labels.impactLabel} {impactScore}/10
          </Badge>
        </div>
        <h3 className="text-base font-semibold text-text-primary mt-2">{headline}</h3>
        <p className="text-xs text-text-secondary">
          {source} &middot; {date}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-text-secondary">{summary}</p>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-start">
            <Badge className="bg-muted text-muted-foreground shrink-0 mt-0.5">
              {labels.shortTermLabel}
            </Badge>
            <p className="text-xs text-text-secondary">{shortTermImpact}</p>
          </div>
          <div className="flex gap-2 items-start">
            <Badge className="bg-muted text-muted-foreground shrink-0 mt-0.5">
              {labels.midTermLabel}
            </Badge>
            <p className="text-xs text-text-secondary">{midTermImpact}</p>
          </div>
        </div>
        {relatedHoldings.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-text-secondary">{labels.relatedLabel}:</span>
            {relatedHoldings.map((ticker) => (
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
