import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 })

  const { id: questionId } = await params
  const { body } = await req.json()

  if (!body || typeof body !== "string" || body.trim().length < 5 || body.trim().length > 3000) {
    return Response.json({ error: "La réponse doit contenir entre 5 et 3000 caractères." }, { status: 400 })
  }

  const question = await prisma.faqQuestion.findUnique({ where: { id: questionId } })
  if (!question) return Response.json({ error: "Question introuvable." }, { status: 404 })

  // Prevent answering your own question for points
  const isOwnQuestion = question.authorId === session.user.id

  const answer = await prisma.faqAnswer.create({
    data: {
      body: body.trim(),
      authorId: session.user.id,
      questionId,
    },
    include: {
      author: { select: { id: true, name: true, image: true, role: true } },
    },
  })

  // Award points for answering (not for own question)
  if (!isOwnQuestion) {
    await prisma.pointTransaction.create({
      data: {
        userId: session.user.id,
        action: "FAQ_ANSWER_GIVEN",
        points: 25,
        label: `Réponse à : « ${question.title.slice(0, 60)}${question.title.length > 60 ? "…" : ""} »`,
      },
    })
  }

  return Response.json(answer, { status: 201 })
}
