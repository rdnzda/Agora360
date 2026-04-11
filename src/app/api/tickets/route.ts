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

  const VALID_CATEGORIES = ["SCOLARITE", "LOGEMENT", "INFORMATIQUE", "AUTRE"]

  if (!title || !description) {
    return Response.json({ error: "Titre et description requis." }, { status: 400 })
  }

  if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 150) {
    return Response.json({ error: "Le titre doit contenir entre 3 et 150 caractères." }, { status: 400 })
  }

  if (typeof description !== "string" || description.trim().length > 5000) {
    return Response.json({ error: "La description ne peut pas dépasser 5000 caractères." }, { status: 400 })
  }

  const safeCategory = category && VALID_CATEGORIES.includes(category) ? category : "AUTRE"

  const ticket = await prisma.ticket.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      category: safeCategory,
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
