type TicketStatusCounts = {
  OPEN: number
  IN_PROGRESS: number
  RESOLVED: number
  CLOSED: number
}

type Props = {
  totalUsers: number
  statusCounts: TicketStatusCounts
}

const statusLabels: Record<keyof TicketStatusCounts, string> = {
  OPEN: "Ouverts",
  IN_PROGRESS: "En cours",
  RESOLVED: "Résolus",
  CLOSED: "Fermés",
}

const statusMarks: Record<keyof TicketStatusCounts, string> = {
  OPEN: "bg-amber-500",
  IN_PROGRESS: "bg-primary",
  RESOLVED: "bg-emerald-600",
  CLOSED: "bg-muted-foreground/50",
}

export function AdminStats({ totalUsers, statusCounts }: Props) {
  return (
    <section className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-baseline justify-between gap-4 px-5 pt-5 pb-4">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground"><span className="w-1 h-5 rounded-full bg-primary" aria-hidden="true" />Vue administration</h2>
        <span className="tabular text-sm text-muted-foreground">{totalUsers} utilisateur{totalUsers > 1 ? "s" : ""}</span>
      </div>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border-t border-border">
        {(Object.keys(statusCounts) as (keyof TicketStatusCounts)[]).map((status) => (
          <div key={status} className="bg-card px-5 py-4">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <span aria-hidden="true" className={`inline-block w-2 h-2 rounded-full ${statusMarks[status]}`} />
              {statusLabels[status]}
            </dt>
            <dd className="tabular mt-1 text-2xl font-extrabold text-foreground">{statusCounts[status]}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
