import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { TicketStatusBadge, TicketCategoryBadge } from "@/components/tickets/ticket-status-badge"
import { TicketTimeline } from "@/components/tickets/ticket-timeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminTicketActions } from "./admin-actions"
import { FadeIn } from "@/components/animations"

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) return null

  const { id } = await params

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true } },
      history: {
        include: { changedBy: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!ticket) notFound()

  if (session.user.role !== "ADMIN" && ticket.authorId !== session.user.id) {
    notFound()
  }

  const isAdmin = session.user.role === "ADMIN"

  return (
    <div className="p-4 md:p-8">
      <FadeIn className="mb-6">
        <Link href="/dashboard/tickets" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Retour aux tickets
        </Link>
        <div className="flex items-start gap-3 mt-2">
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex-1">{ticket.title}</h1>
        </div>
        <div className="flex items-center flex-wrap gap-2 mt-2">
          <TicketStatusBadge status={ticket.status as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"} />
          <TicketCategoryBadge category={ticket.category as "SCOLARITE" | "LOGEMENT" | "INFORMATIQUE" | "AUTRE"} />
          <span className="text-xs text-muted-foreground ml-1">
            Soumis le {new Date(ticket.createdAt).toLocaleDateString("fr-FR")} par {ticket.author.name}
          </span>
        </div>
      </FadeIn>

      <div className="space-y-4">
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-wrap text-sm leading-relaxed">{ticket.description}</p>
            </CardContent>
          </Card>
        </FadeIn>

        {isAdmin && (
          <FadeIn delay={0.18}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Actions administrateur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdminTicketActions
                  ticketId={ticket.id}
                  currentStatus={ticket.status}
                  currentAssignedToId={ticket.assignedToId}
                  adminId={session.user.id}
                  adminName={session.user.name ?? "Admin"}
                />
              </CardContent>
            </Card>
          </FadeIn>
        )}

        <FadeIn delay={0.26}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Suivi en temps réel — Historique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TicketTimeline
                history={ticket.history.map((h) => ({
                  ...h,
                  createdAt: h.createdAt.toISOString(),
                }))}
              />
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
