import { Badge } from "@/components/ui/badge"

type ProjectStatus = "PROPOSED" | "ACTIVE" | "FUNDED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED"

const config: Record<ProjectStatus, { label: string; className: string }> = {
  PROPOSED: { label: "Proposé",    className: "bg-muted text-muted-foreground border-border" },
  ACTIVE:   { label: "Vote ouvert", className: "bg-primary/10 text-primary border-primary/20" },
  FUNDED:   { label: "Financé",    className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  IN_PROGRESS: { label: "En cours", className: "bg-amber-50 text-amber-700 border-amber-200" },
  COMPLETED: { label: "Terminé",   className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  REJECTED: { label: "Rejeté",     className: "bg-red-50 text-red-600 border-red-200" },
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const c = config[status] ?? config.PROPOSED
  return (
    <Badge variant="outline" className={c.className}>
      {c.label}
    </Badge>
  )
}
