import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ComingSoonCardProps {
  title: string;  // already-translated, e.g. "Performance Chart"
  label: string;  // already-translated, e.g. "Coming in Phase 3"
}

export default function ComingSoonCard({ title, label }: ComingSoonCardProps) {
  return (
    <Card className="border-dashed border-border bg-surface/50">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-8 w-full" />
        </div>
        <p className="text-text-muted text-sm mt-3">{label}</p>
      </CardContent>
    </Card>
  );
}
