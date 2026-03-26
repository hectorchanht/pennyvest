import RiskGauge from '@/components/strategy/RiskGauge';
import { Link } from '@/i18n/navigation';
import type { RiskLevel } from '@/lib/strategies/types';

interface AllocationSidebarProps {
  riskLevel: RiskLevel;
  riskLabel: string;
  allocations: Array<{ ticker: string; name: string; weight: number }>;
  labels: {
    allocationTitle: string;
    profilesLink: string;
  };
}

export default function AllocationSidebar({
  riskLevel,
  riskLabel,
  allocations,
  labels,
}: AllocationSidebarProps) {
  const sorted = [...allocations].sort((a, b) => b.weight - a.weight);

  return (
    <div className="sticky top-20 space-y-4">
      <RiskGauge level={riskLevel} label={riskLabel} />

      <div>
        <h3 className="text-sm font-medium text-text-primary mb-2">
          {labels.allocationTitle}
        </h3>
        <ul className="space-y-1">
          {sorted.map((item) => (
            <li key={item.ticker} className="flex items-center justify-between text-sm">
              <span className="font-mono text-text-primary">{item.ticker}</span>
              <span className="text-text-secondary">{Math.round(item.weight * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/profiles"
        className="block text-brand-green hover:text-brand-green-light text-sm"
      >
        {labels.profilesLink}
      </Link>
    </div>
  );
}
