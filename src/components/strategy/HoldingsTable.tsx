import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

interface HoldingsTableProps {
  allocations: Array<{
    ticker: string;
    name: string;
    weight: number; // 0-1 decimal
  }>;
  labels: {
    ticker: string;  // "Ticker" / "代號"
    name: string;    // "Name" / "名稱"
    weight: string;  // "Weight" / "比重"
  };
  prices?: Record<string, { price: number; change24h: number | null }>;
  priceLabels?: { price: string; change24h: string };
}

function formatPrice(price: number): string {
  if (price < 1) return `$${price.toFixed(6)}`;
  return `$${price.toFixed(2)}`;
}

function formatChange(change: number | null): { text: string; className: string } {
  if (change === null) {
    return { text: '—', className: 'text-text-muted' };
  }
  const sign = change >= 0 ? '+' : '';
  const text = `${sign}${change.toFixed(2)}%`;
  const className = change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-text-muted';
  return { text, className };
}

export default function HoldingsTable({ allocations, labels, prices, priceLabels }: HoldingsTableProps) {
  const sorted = [...allocations].sort((a, b) => b.weight - a.weight);
  const showPrices = Boolean(prices && priceLabels);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">{labels.ticker}</TableHead>
          <TableHead className="text-left">{labels.name}</TableHead>
          <TableHead className="text-right">{labels.weight}</TableHead>
          {showPrices && priceLabels && (
            <>
              <TableHead className="text-right">{priceLabels.price}</TableHead>
              <TableHead className="text-right">{priceLabels.change24h}</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((allocation) => {
          const priceData = prices?.[allocation.ticker];
          const change = priceData ? formatChange(priceData.change24h) : null;
          return (
            <TableRow key={allocation.ticker}>
              <TableCell className="font-mono text-text-primary font-medium">
                {allocation.ticker}
              </TableCell>
              <TableCell className="text-text-secondary">
                {allocation.name}
              </TableCell>
              <TableCell className="text-right text-text-secondary">
                {Math.round(allocation.weight * 100)}%
              </TableCell>
              {showPrices && (
                <>
                  <TableCell className="text-right font-mono text-text-primary text-sm">
                    {priceData ? formatPrice(priceData.price) : '—'}
                  </TableCell>
                  <TableCell className={`text-right font-mono text-sm ${change?.className ?? 'text-text-muted'}`}>
                    {change?.text ?? '—'}
                  </TableCell>
                </>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
