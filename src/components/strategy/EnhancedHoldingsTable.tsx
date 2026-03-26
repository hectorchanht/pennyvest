import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

interface EnhancedAllocation {
  ticker: string;
  weight: number;        // 0-1 decimal
  dailyChangePct: number; // e.g. 1.85 for +1.85%, negative for losses
}

interface EnhancedHoldingsTableProps {
  allocations: EnhancedAllocation[];
  portfolioValue: number; // e.g. 1_000_000
  cashRatio: number;      // percentage, e.g. 2.0
  labels: {
    ticker: string;
    allocation: string;
    marketValue: string;
    dailyChangePct: string;
    dailyChangeAmt: string;
    cash: string;
  };
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${Math.round(value).toLocaleString()}`;
  }
  return `$${value.toFixed(0)}`;
}

function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function formatChangeAmount(value: number): string {
  const sign = value >= 0 ? '+' : '-';
  const abs = Math.abs(value);
  if (abs >= 1_000) {
    return `${sign}$${Math.round(abs).toLocaleString()}`;
  }
  return `${sign}$${abs.toFixed(0)}`;
}

export default function EnhancedHoldingsTable({
  allocations,
  portfolioValue,
  cashRatio,
  labels,
}: EnhancedHoldingsTableProps) {
  const investedRatio = (100 - cashRatio) / 100;
  const investedValue = portfolioValue * investedRatio;

  // Normalise weights among holdings so they sum to investedRatio of the portfolio
  const totalWeight = allocations.reduce((sum, a) => sum + a.weight, 0);

  const sorted = [...allocations].sort((a, b) => b.weight - a.weight);

  const cashMarketValue = portfolioValue * (cashRatio / 100);

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden mb-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">{labels.ticker}</TableHead>
            <TableHead className="text-right">{labels.allocation}</TableHead>
            <TableHead className="text-right">{labels.marketValue}</TableHead>
            <TableHead className="text-right">{labels.dailyChangePct}</TableHead>
            <TableHead className="text-right">{labels.dailyChangeAmt}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((allocation) => {
            const normalisedWeight = totalWeight > 0 ? allocation.weight / totalWeight : 0;
            const marketValue = investedValue * normalisedWeight;
            const changeAmt = marketValue * (allocation.dailyChangePct / 100);
            const isPositive = allocation.dailyChangePct >= 0;

            return (
              <TableRow key={allocation.ticker}>
                <TableCell className="font-mono text-text-primary font-medium uppercase">
                  {allocation.ticker}
                </TableCell>
                <TableCell className="text-right text-text-secondary">
                  {Math.round(allocation.weight * 100)}%
                </TableCell>
                <TableCell className="text-right text-text-secondary">
                  {formatCurrency(marketValue)}
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${isPositive ? 'text-brand-green' : 'text-red-400'}`}
                >
                  {formatChange(allocation.dailyChangePct)}
                </TableCell>
                <TableCell
                  className={`text-right text-sm ${isPositive ? 'text-brand-green' : 'text-red-400'}`}
                >
                  {formatChangeAmount(changeAmt)}
                </TableCell>
              </TableRow>
            );
          })}

          {/* Cash row */}
          <TableRow className="border-t border-border/50">
            <TableCell className="font-mono text-text-secondary font-medium">
              {labels.cash}
            </TableCell>
            <TableCell className="text-right text-text-secondary">
              {cashRatio.toFixed(1)}%
            </TableCell>
            <TableCell className="text-right text-text-secondary">
              {formatCurrency(cashMarketValue)}
            </TableCell>
            <TableCell className="text-right text-text-muted">—</TableCell>
            <TableCell className="text-right text-text-muted">—</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
