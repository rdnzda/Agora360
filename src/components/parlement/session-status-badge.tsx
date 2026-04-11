type Status = "CANDIDATURES" | "ACTIF" | "CLOS"

const config: Record<Status, { label: string; dot: string; pill: string }> = {
  CANDIDATURES: {
    label: "Candidatures ouvertes",
    dot: "bg-amber-400 animate-pulse",
    pill: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  },
  ACTIF: {
    label: "Parlement actif",
    dot: "bg-primary animate-pulse",
    pill: "bg-primary/10 text-primary border border-primary/20",
  },
  CLOS: {
    label: "Session close",
    dot: "bg-muted-foreground/40",
    pill: "bg-muted text-muted-foreground border border-border",
  },
}

export function ParlementSessionStatusBadge({ status }: { status: Status }) {
  const c = config[status] ?? config.CLOS
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${c.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}
