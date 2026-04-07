"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { StaggerList, StaggerItem } from "@/components/animations"
import { TicketStatusBadge, TicketCategoryBadge } from "./ticket-status-badge"

type Ticket = {
  id: string
  title: string
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  category: "SCOLARITE" | "LOGEMENT" | "INFORMATIQUE" | "AUTRE"
  createdAt: string
  author: { name: string | null }
  assignedTo: { name: string | null } | null
}

export function TicketCardsMobile({ tickets, isAdmin }: { tickets: Ticket[]; isAdmin: boolean }) {
  return (
    <StaggerList className="flex flex-col gap-3 md:hidden">
      {tickets.map((ticket) => (
        <StaggerItem key={ticket.id}>
          <Link
            href={`/dashboard/tickets/${ticket.id}`}
            className="block bg-card border border-border rounded-xl p-4 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-foreground text-sm leading-snug flex-1 line-clamp-2">
                {ticket.title}
              </p>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <TicketStatusBadge status={ticket.status} />
              <TicketCategoryBadge category={ticket.category} />
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {isAdmin && <span>{ticket.author.name}</span>}
                {ticket.assignedTo && (
                  <span className="before:content-['·'] before:mr-2">
                    {ticket.assignedTo.name}
                  </span>
                )}
              </div>
              <span>{new Date(ticket.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </StaggerList>
  )
}
