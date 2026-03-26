import { Badge } from '@/components/ui/badge';

interface HoldingAdjustment {
  ticker: string;
  action: 'hold' | 'add' | 'reduce';
  reasoning: string;
}

interface PortfolioNotesProps {
  actionSummary: string;
  description: string;
  holdingAdjustments: HoldingAdjustment[];
  riskNote: string;
  cashNote: string;
  labels: {
    title: string;
    subtitle: string;
    riskManagement: string;
    cashStrategy: string;
    actionHold: string;
    actionAdd: string;
    actionReduce: string;
  };
}

function getActionBadgeClass(action: 'hold' | 'add' | 'reduce'): string {
  switch (action) {
    case 'add':    return 'bg-brand-green/20 text-brand-green';
    case 'reduce': return 'bg-rose-500/20 text-rose-400';
    case 'hold':   return 'bg-muted text-muted-foreground';
  }
}

export default function PortfolioNotes({
  actionSummary,
  description,
  holdingAdjustments,
  riskNote,
  cashNote,
  labels,
}: PortfolioNotesProps) {
  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-text-primary">{labels.title}</h2>
        <p className="text-sm text-text-secondary mt-1">{labels.subtitle}</p>
      </div>

      <div className="bg-surface rounded-xl border border-border p-5 space-y-5">
        {/* Action summary badge + description */}
        <div>
          <Badge className="bg-brand-green/20 text-brand-green text-sm mb-3">
            {actionSummary}
          </Badge>
          <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
        </div>

        {/* Per-holding adjustments */}
        {holdingAdjustments.length > 0 && (
          <div className="space-y-3">
            {holdingAdjustments.map((adj) => (
              <div key={adj.ticker} className="flex items-start gap-3">
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  <span className="font-mono text-sm font-medium text-text-primary w-20">
                    {adj.ticker}
                  </span>
                  <Badge className={`${getActionBadgeClass(adj.action)} text-xs`}>
                    {adj.action === 'hold'
                      ? labels.actionHold
                      : adj.action === 'add'
                      ? labels.actionAdd
                      : labels.actionReduce}
                  </Badge>
                </div>
                <p className="text-sm text-text-secondary">{adj.reasoning}</p>
              </div>
            ))}
          </div>
        )}

        {/* Risk management */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
            {labels.riskManagement}
          </p>
          <p className="text-sm text-text-secondary">{riskNote}</p>
        </div>

        {/* Cash strategy */}
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
            {labels.cashStrategy}
          </p>
          <p className="text-sm text-text-secondary">{cashNote}</p>
        </div>
      </div>
    </section>
  );
}
