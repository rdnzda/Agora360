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

const statusColors: Record<keyof TicketStatusCounts, string> = {
  OPEN: "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-primary/10 text-primary",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-muted text-muted-foreground",
}

export function AdminStats({ totalUsers, statusCounts }: Props) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Vue administration</h3>
        <span className="text-xs text-muted-foreground">{totalUsers} utilisateur{totalUsers > 1 ? "s" : ""}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(statusCounts) as (keyof TicketStatusCounts)[]).map((status) => (
          <div key={status} className="text-center">
            <div className={`inline-flex items-center justify-center w-full rounded-lg px-3 py-2 text-lg font-bold mb-1 ${statusColors[status]}`}>
              {statusCounts[status]}
            </div>
            <p className="text-xs text-muted-foreground">{statusLabels[status]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
