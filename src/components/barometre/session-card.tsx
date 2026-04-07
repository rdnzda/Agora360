import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Props = {
  id: string
  weekLabel: string
  status: "OPEN" | "CLOSED"
  responseCount: number
  isAdmin?: boolean
}

export function SessionCard({ id, weekLabel, status, responseCount, isAdmin }: Props) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{weekLabel}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{responseCount} réponse{responseCount !== 1 ? "s" : ""}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={status === "OPEN" ? "text-emerald-700 border-emerald-300 bg-emerald-50" : "text-muted-foreground"}
        >
          {status === "OPEN" ? "Ouverte" : "Fermée"}
        </Badge>
        {isAdmin && (
          <Link href={`/dashboard/barometre/resultats/${id}`}>
            <Button variant="ghost" size="sm">Résultats →</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
