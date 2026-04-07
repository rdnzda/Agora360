import { Badge } from "@/components/ui/badge"

const statusConfig = {
  OPEN: { label: "Ouvert", className: "bg-amber-50 text-amber-700 border-amber-200" },
  IN_PROGRESS: { label: "En cours", className: "bg-primary/10 text-primary border-primary/20" },
  RESOLVED: { label: "Résolu", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CLOSED: { label: "Fermé", className: "bg-muted text-muted-foreground border-border" },
}

const categoryConfig = {
  SCOLARITE: { label: "Scolarité" },
  LOGEMENT: { label: "Logement" },
  INFORMATIQUE: { label: "Informatique" },
  AUTRE: { label: "Autre" },
}

export function TicketStatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status] ?? statusConfig.OPEN
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

export function TicketCategoryBadge({ category }: { category: keyof typeof categoryConfig }) {
  const config = categoryConfig[category] ?? categoryConfig.AUTRE
  return (
    <Badge variant="secondary" className="text-xs">
      {config.label}
    </Badge>
  )
}

export { statusConfig, categoryConfig }
