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
  dailyChangePct?: number;
  topHoldings?: Array<{ ticker: string; weight: number }>;
  dailyChangeLabel?: string;
  accentColor?: string;
  isHighlighted?: boolean;
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
  dailyChangePct,
  topHoldings,
  dailyChangeLabel,
  accentColor,
  isHighlighted,
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
          .join(' \u00b7 ')
      : null;

  return (
    <Link href={`/fund/${slug}`} className="block">
      <Card
        className="relative h-full cursor-pointer transition-all duration-300 hover:bg-surface-hover hover:scale-[1.02] hover:shadow-lg p-5"
        style={{
          borderColor: isHighlighted && accentColor ? accentColor : undefined,
          borderWidth: isHighlighted ? '1.5px' : undefined,
          boxShadow: isHighlighted && accentColor
            ? `0 0 12px 2px ${accentColor}33, 0 0 24px 4px ${accentColor}15`
            : undefined,
        }}
      >
        {/* Accent bar at top */}
        {accentColor && (
          <div
            className="absolute top-0 left-4 right-4 h-0.5 rounded-full transition-opacity duration-300"
            style={{
              backgroundColor: accentColor,
              opacity: isHighlighted ? 1 : 0.4,
            }}
          />
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-1 items-end">
          <Badge className={riskColors[riskLevel]}>{riskLabel}</Badge>
          {weight !== undefined && (
            <Badge variant="outline">
              {Math.round(weight * 100)}%
            </Badge>
          )}
        </div>
        <CardHeader className="p-0">
          <CardTitle className="flex items-center gap-2">
            {accentColor && (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              />
            )}
            {name}
          </CardTitle>
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
