import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 })

  const questions = await prisma.faqQuestion.findMany({
    include: {
      author: { select: { id: true, name: true, image: true, role: true } },
      answers: {
        include: {
          author: { select: { id: true, name: true, image: true, role: true } },
        },
        orderBy: [{ accepted: "desc" }, { createdAt: "asc" }],
      },
    },
    orderBy: [{ resolved: "asc" }, { createdAt: "desc" }],
  })

  return Response.json(questions)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 })

  const { title, body } = await req.json()

  if (!title || typeof title !== "string" || title.trim().length < 5 || title.trim().length > 200) {
    return Response.json({ error: "Le titre doit contenir entre 5 et 200 caractères." }, { status: 400 })
  }
  if (body && typeof body !== "string") {
    return Response.json({ error: "Corps invalide." }, { status: 400 })
  }

  const question = await prisma.faqQuestion.create({
    data: {
      title: title.trim(),
      body: body?.trim() || null,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, image: true, role: true } },
      answers: [],
    },
  })

  return Response.json(question, { status: 201 })
}
