import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 })

  const where = session.user.role === "ADMIN" ? {} : { authorId: session.user.id }

  const tickets = await prisma.ticket.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return Response.json(tickets)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 })

  const { title, description, category } = await req.json()

  if (!title || !description) {
    return Response.json({ error: "Titre et description requis." }, { status: 400 })
  }

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      category: category ?? "AUTRE",
      authorId: session.user.id,
    },
  })

  await prisma.ticketHistory.create({
    data: {
      ticketId: ticket.id,
      status: "OPEN",
      comment: "Ticket soumis",
      changedById: session.user.id,
    },
  })

  return Response.json(ticket, { status: 201 })
}
