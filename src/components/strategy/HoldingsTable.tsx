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
}

export default function HoldingsTable({ allocations, labels }: HoldingsTableProps) {
  const sorted = [...allocations].sort((a, b) => b.weight - a.weight);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">{labels.ticker}</TableHead>
          <TableHead className="text-left">{labels.name}</TableHead>
          <TableHead className="text-right">{labels.weight}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((allocation) => (
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
