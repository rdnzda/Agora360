import Link from "next/link"
import { TicketStatusBadge, TicketCategoryBadge } from "@/components/tickets/ticket-status-badge"
import { Button } from "@/components/ui/button"

type Ticket = {
  id: string
  title: string
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  category: "SCOLARITE" | "LOGEMENT" | "INFORMATIQUE" | "AUTRE"
  createdAt: string
  author: { name: string | null }
}

type Props = {
  tickets: Ticket[]
  isAdmin: boolean
}

export function RecentTickets({ tickets, isAdmin }: Props) {
  if (tickets.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6">
        {isAdmin
          ? "Aucun ticket n'a encore été soumis. Les nouvelles demandes apparaîtront ici."
          : "Vous n'avez pas encore de ticket. Signalez une démarche avec « Nouveau ticket » ci-dessus."}
      </p>
    )
  }

  return (
    <div className="divide-y divide-border">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="flex flex-wrap sm:flex-nowrap items-center gap-x-3 gap-y-2 py-3">
          <div className="flex-1 min-w-[12rem]">
            <p className="text-sm font-medium text-foreground truncate">{ticket.title}</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
              <TicketCategoryBadge category={ticket.category} />
              {isAdmin && ticket.author.name && (
                <span className="text-xs text-muted-foreground">{ticket.author.name}</span>
              )}
              <span className="tabular text-xs text-muted-foreground whitespace-nowrap">
                {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <TicketStatusBadge status={ticket.status} />
            <Link href={`/dashboard/tickets/${ticket.id}`}>
              <Button variant="ghost" size="sm" className="text-xs" aria-label={`Voir le ticket : ${ticket.title}`}>
                Voir
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
