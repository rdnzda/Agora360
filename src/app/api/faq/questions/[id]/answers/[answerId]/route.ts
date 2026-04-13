import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH — mark an answer as accepted (question author or admin only)
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; answerId: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 })

  const { id: questionId, answerId } = await params

  const question = await prisma.faqQuestion.findUnique({ where: { id: questionId } })
  if (!question) return Response.json({ error: "Question introuvable." }, { status: 404 })

  const isAuthor = question.authorId === session.user.id
  const isAdmin = session.user.role === "ADMIN"
  if (!isAuthor && !isAdmin) {
    return Response.json({ error: "Seul l'auteur ou un admin peut accepter une réponse." }, { status: 403 })
  }

  const answer = await prisma.faqAnswer.findUnique({ where: { id: answerId } })
  if (!answer || answer.questionId !== questionId) {
    return Response.json({ error: "Réponse introuvable." }, { status: 404 })
  }

  // Toggle accepted state
  const alreadyAccepted = answer.accepted

  await prisma.$transaction(async (tx) => {
    // Unmark any previously accepted answer for this question
    await tx.faqAnswer.updateMany({
      where: { questionId, accepted: true },
      data: { accepted: false },
    })

    if (!alreadyAccepted) {
      // Mark this one accepted + resolve question
      await tx.faqAnswer.update({ where: { id: answerId }, data: { accepted: true } })
      await tx.faqQuestion.update({ where: { id: questionId }, data: { resolved: true } })

      // Award bonus points to the answer author (only if not own question)
      if (answer.authorId !== question.authorId) {
        await tx.pointTransaction.create({
          data: {
            userId: answer.authorId,
            action: "FAQ_ANSWER_ACCEPTED",
            points: 50,
            label: `Réponse acceptée : « ${question.title.slice(0, 60)}${question.title.length > 60 ? "…" : ""} »`,
          },
        })
      }
    } else {
      // Un-accepting: reopen the question
      await tx.faqQuestion.update({ where: { id: questionId }, data: { resolved: false } })
    }
  })

  return Response.json({ ok: true })
}
