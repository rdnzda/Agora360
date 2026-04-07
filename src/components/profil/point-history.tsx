type Transaction = {
  id: string
  label: string
  points: number
  createdAt: string | Date
}

export function PointHistory({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">Aucun point gagné pour l&apos;instant.</p>
  }

  return (
    <div className="divide-y divide-border">
      {transactions.map((t) => (
        <div key={t.id} className="flex items-center justify-between py-2.5">
          <p className="text-sm text-foreground">{t.label}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {new Date(t.createdAt).toLocaleDateString("fr-FR")}
            </span>
            <span className="text-sm font-semibold text-primary">+{t.points} pts</span>
          </div>
        </div>
      ))}
    </div>
  )
}
