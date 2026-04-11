import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 })

  const { id } = await params

  // Push ownership into the query — prevents fetching data the user can't see
  const where = session.user.role === "ADMIN"
    ? { id }
    : { id, authorId: session.user.id }

  const ticket = await prisma.ticket.findUnique({
    where,
    include: {
      author: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true } },
      history: {
        include: { changedBy: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  // Return 403 (not 404) so existence of other tickets isn't revealed
  if (!ticket) return Response.json({ error: "Non autorisé" }, { status: 403 })

  return Response.json(ticket)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 })
  if (session.user.role !== "ADMIN") {
    return Response.json({ error: "Réservé aux administrateurs" }, { status: 403 })
  }

  const { id } = await params
  const { status, comment, assignedToId } = await req.json()

  const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return Response.json({ error: "Statut invalide." }, { status: 400 })
  }
  if (comment !== undefined && (typeof comment !== "string" || comment.length > 2000)) {
    return Response.json({ error: "Le commentaire ne peut pas dépasser 2000 caractères." }, { status: 400 })
  }

  const ticket = await prisma.ticket.findUnique({ where: { id } })
  if (!ticket) return Response.json({ error: "Ticket introuvable" }, { status: 404 })

  const updated = await prisma.ticket.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(assignedToId !== undefined && { assignedToId }),
    },
    include: {
      author: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true } },
    },
  })

  if (status) {
    await prisma.ticketHistory.create({
      data: {
        ticketId: id,
        status,
        comment: comment ?? null,
        changedById: session.user.id,
      },
    })
  }

  return Response.json(updated)
}
