type Props = {
  envelope: number
  allocated: number
  remaining: number
}

function formatEur(n: number) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
}

export function BudgetOverviewBar({ envelope, allocated, remaining }: Props) {
  const allocatedPct = envelope > 0 ? Math.min((allocated / envelope) * 100, 100) : 0

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Enveloppe budgétaire</h2>
        <span className="text-sm font-bold text-foreground">{formatEur(envelope)}</span>
      </div>

      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${allocatedPct}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span><span className="font-medium text-primary">{formatEur(allocated)}</span> alloués ({allocatedPct.toFixed(0)}%)</span>
        <span><span className="font-medium text-foreground">{formatEur(remaining)}</span> disponibles</span>
      </div>
    </div>
  )
}
