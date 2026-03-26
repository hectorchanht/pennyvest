import { Link } from '@/i18n/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RiskLevel } from '@/lib/strategies/types';

interface StrategyCardProps {
  slug: string;
  name: string;
  tagline: string;
  riskLevel: RiskLevel;
  riskLabel: string;
  weight?: number;
  weightLabel?: string;
  dailyChangePct?: number;    // e.g. 2.25 or -1.5
  topHoldings?: Array<{ ticker: string; weight: number }>;
  dailyChangeLabel?: string;  // translated "Daily" label
}

const riskColors: Record<RiskLevel, string> = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function StrategyCard({
  slug,
  name,
  tagline,
  riskLevel,
  riskLabel,
  weight,
  weightLabel,
  dailyChangePct,
  topHoldings,
  dailyChangeLabel,
}: StrategyCardProps) {
  const isPositive = dailyChangePct !== undefined && dailyChangePct >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const formattedChange =
    dailyChangePct !== undefined
      ? `${isPositive ? '+' : ''}${dailyChangePct.toFixed(2)}%`
      : null;

  const holdingsLine =
    topHoldings && topHoldings.length > 0
      ? topHoldings
          .map((h) => `${h.ticker} ${Math.round(h.weight * 100)}%`)
          .join(' · ')
      : null;

  return (
    <Link href={`/fund/${slug}`} className="block">
      <Card className="relative h-full cursor-pointer transition-all duration-200 hover:bg-surface-hover hover:scale-[1.02] hover:shadow-lg p-5">
        <div className="absolute right-3 top-3 flex flex-col gap-1 items-end">
          <Badge className={riskColors[riskLevel]}>{riskLabel}</Badge>
          {weight !== undefined && weightLabel && (
            <Badge variant="outline">
              {Math.round(weight * 100)}%
            </Badge>
          )}
        </div>
        <CardHeader className="p-0">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{tagline}</CardDescription>
        </CardHeader>
        {dailyChangePct !== undefined && (
          <CardContent className="p-0 pt-3 flex flex-col gap-1">
            <div className="flex items-baseline gap-1.5">
              {dailyChangeLabel && (
                <span className="text-xs text-text-secondary">{dailyChangeLabel}</span>
              )}
              <span className={`text-lg font-semibold ${changeColor}`}>
                {formattedChange}
              </span>
            </div>
            {holdingsLine && (
              <p className="text-xs text-text-secondary">{holdingsLine}</p>
            )}
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
