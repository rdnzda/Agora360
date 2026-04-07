import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TicketStatusBadge, TicketCategoryBadge } from "@/components/tickets/ticket-status-badge"
import { TicketCardsMobile } from "@/components/tickets/ticket-cards-mobile"
import { FadeIn } from "@/components/animations"
import { Inbox } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function TicketsPage() {
  const session = await auth()
  if (!session) return null

  const isAdmin = session.user.role === "ADMIN"
  const where = isAdmin ? {} : { authorId: session.user.id }

  const tickets = await prisma.ticket.findMany({
    where,
    include: {
      author: { select: { name: true } },
      assignedTo: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const serializedTickets = tickets.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
  }))

  return (
    <div className="p-4 md:p-8">
      <FadeIn className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            GPS Admin — Suivi des tickets
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin
              ? `${tickets.length} ticket(s) au total`
              : "Suivez vos demandes en temps réel"}
          </p>
        </div>
        {!isAdmin && (
          <Link href="/dashboard/tickets/new">
            <Button size="sm">+ Nouveau ticket</Button>
          </Link>
        )}
      </FadeIn>

      {tickets.length === 0 ? (
        <FadeIn delay={0.1} className="text-center py-20 text-muted-foreground">
          <Inbox className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Aucun ticket pour l&apos;instant</p>
          {!isAdmin && (
            <Link href="/dashboard/tickets/new">
              <Button className="mt-4" variant="outline">
                Soumettre ma première demande
              </Button>
            </Link>
          )}
        </FadeIn>
      ) : (
        <>
          {/* Desktop — table */}
          <FadeIn delay={0.1} className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col" aria-sort="none">Titre</TableHead>
                  <TableHead scope="col" aria-sort="none">Catégorie</TableHead>
                  <TableHead scope="col" aria-sort="none">Statut</TableHead>
                  {isAdmin && <TableHead scope="col" aria-sort="none">Étudiant</TableHead>}
                  <TableHead scope="col" aria-sort="none">Assigné à</TableHead>
                  <TableHead scope="col" aria-sort="descending">Date</TableHead>
                  <TableHead scope="col" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium max-w-xs truncate" title={ticket.title}>
                      {ticket.title}
                    </TableCell>
                    <TableCell>
                      <TicketCategoryBadge category={ticket.category as "SCOLARITE" | "LOGEMENT" | "INFORMATIQUE" | "AUTRE"} />
                    </TableCell>
                    <TableCell>
                      <TicketStatusBadge status={ticket.status as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"} />
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-sm text-muted-foreground">
                        {ticket.author.name}
                      </TableCell>
                    )}
                    <TableCell className="text-sm text-muted-foreground">
                      {ticket.assignedTo?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/tickets/${ticket.id}`}>
                        <Button variant="ghost" size="sm" aria-label={`Voir le ticket : ${ticket.title}`}>
                          Voir →
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </FadeIn>

          {/* Mobile — animated cards */}
          <TicketCardsMobile tickets={serializedTickets} isAdmin={isAdmin} />
        </>
      )}
    </div>
  )
}
