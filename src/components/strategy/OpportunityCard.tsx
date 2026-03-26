import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface OpportunityCardData {
  title: string;
  description: string;
  confidence: number;  // 1-10
  horizon: string;
  logic: string;
  catalysts: string[];
  risks: string[];
  actions: Array<{ ticker: string; action: 'hold' | 'add' | 'reduce' }>;
}

interface OpportunityCardProps {
  data: OpportunityCardData;
  labels: {
    confidence: string;
    horizon: string;
    logic: string;
    catalysts: string;
    risks: string;
    actionHold: string;
    actionAdd: string;
    actionReduce: string;
  };
}

function getConfidenceColor(score: number): string {
  if (score >= 8) return 'bg-brand-green/20 text-brand-green';
  if (score >= 6) return 'bg-amber-500/20 text-amber-400';
  return 'bg-rose-500/20 text-rose-400';
}

function getActionBadgeClass(action: 'hold' | 'add' | 'reduce'): string {
  switch (action) {
    case 'add':    return 'bg-brand-green/20 text-brand-green';
    case 'reduce': return 'bg-rose-500/20 text-rose-400';
    case 'hold':   return 'bg-muted text-muted-foreground';
  }
}

export default function OpportunityCard({ data, labels }: OpportunityCardProps) {
  const confidenceClass = getConfidenceColor(data.confidence);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-text-primary flex-1">{data.title}</h3>
          <Badge className={`${confidenceClass} shrink-0 text-xs`}>
            {labels.confidence} {data.confidence}/10
          </Badge>
        </div>
        <p className="text-sm text-text-secondary mt-1">{data.description}</p>
        <p className="text-xs text-text-muted mt-1">
          <span className="font-medium text-text-secondary">{labels.horizon}:</span>{' '}
          {data.horizon}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Logic */}
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
            {labels.logic}
          </p>
          <p className="text-sm text-text-secondary">{data.logic}</p>
        </div>

        {/* Catalysts */}
        {data.catalysts.length > 0 && (
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
              {labels.catalysts}
            </p>
            <ul className="space-y-1">
              {data.catalysts.map((catalyst, i) => (
                <li key={i} className="flex items-start gap-1.5 text-sm text-text-secondary">
                  <span className="text-brand-green mt-0.5">▸</span>
                  <span>{catalyst}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk factors */}
        {data.risks.length > 0 && (
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
              {labels.risks}
            </p>
            <ul className="space-y-1">
              {data.risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-1.5 text-sm text-text-secondary">
                  <span className="text-red-400 mt-0.5">▸</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action recommendations */}
        {data.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
            {data.actions.map((rec) => (
              <div key={rec.ticker} className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-text-primary">{rec.ticker}</span>
                <Badge className={`${getActionBadgeClass(rec.action)} text-xs`}>
                  {rec.action === 'hold'
                    ? labels.actionHold
                    : rec.action === 'add'
                    ? labels.actionAdd
                    : labels.actionReduce}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
