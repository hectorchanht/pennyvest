import { Badge } from '@/components/ui/badge';

interface StatItem {
  label: string;
  value: string;
  isPositive?: boolean;
  isNegative?: boolean;
}

interface FundHeaderProps {
  fundName: string;
  date: string;
  stats: StatItem[];
  labels: {
    trackingLive: string;
    modelPortfolio: string;
  };
}

export default function FundHeader({ fundName, date, stats, labels }: FundHeaderProps) {
  return (
    <div className="bg-surface rounded-xl p-6 mb-6 border border-border">
      {/* Top row: name + date + badge */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{fundName}</h1>
          <p className="text-sm text-text-secondary mt-1">{date}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-1.5">
          {/* Tracking Live badge with green pulse */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green" />
            </span>
            <Badge className="bg-brand-green/20 text-brand-green border-0 text-xs">
              {labels.trackingLive}
            </Badge>
          </div>
          <span className="text-xs text-text-secondary">{labels.modelPortfolio}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="text-xs text-text-secondary uppercase tracking-wide">
              {stat.label}
            </span>
            <span
              className={[
                'text-xl font-bold',
                stat.isPositive ? 'text-brand-green' : '',
                stat.isNegative ? 'text-red-400' : '',
                !stat.isPositive && !stat.isNegative ? 'text-text-primary' : '',
              ].join(' ')}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
