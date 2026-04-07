import { Badge } from "@/components/ui/badge"

type Status = "CANDIDATURES" | "ACTIF" | "CLOS"

const config: Record<Status, { label: string; className: string }> = {
  CANDIDATURES: { label: "Candidatures ouvertes", className: "bg-amber-50 text-amber-700 border-amber-200" },
  ACTIF:        { label: "Parlement actif",        className: "bg-primary/10 text-primary border-primary/20" },
  CLOS:         { label: "Session close",          className: "bg-muted text-muted-foreground border-border" },
}

export function ParlementSessionStatusBadge({ status }: { status: Status }) {
  const c = config[status] ?? config.CLOS
  return (
    <Badge variant="outline" className={c.className}>
      {c.label}
    </Badge>
  )
}
