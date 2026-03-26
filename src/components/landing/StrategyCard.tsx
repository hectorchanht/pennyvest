import { Link } from '@/i18n/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
}: StrategyCardProps) {
  return (
    <Link href={`/fund/${slug}`} className="block">
      <Card className="relative h-full cursor-pointer transition-all duration-200 hover:bg-surface-hover hover:scale-[1.02] hover:shadow-lg">
        <div className="absolute right-3 top-3 flex flex-col gap-1 items-end">
          <Badge className={riskColors[riskLevel]}>{riskLabel}</Badge>
          {weight !== undefined && weightLabel && (
            <Badge variant="outline">
              {Math.round(weight * 100)}%
            </Badge>
          )}
        </div>
        <CardHeader className="pr-20">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{tagline}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
