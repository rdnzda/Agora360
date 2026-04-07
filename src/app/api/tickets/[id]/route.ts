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

  if (!ticket) return Response.json({ error: "Ticket introuvable" }, { status: 404 })

  // Un étudiant ne peut voir que ses propres tickets
  if (session.user.role !== "ADMIN" && ticket.authorId !== session.user.id) {
    return Response.json({ error: "Non autorisé" }, { status: 403 })
  }

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
