import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { id: sessionId } = await params
  const isAdmin = session.user.role === "ADMIN"

  if (isAdmin) {
    const responses = await prisma.barometreResponse.findMany({
      where: { sessionId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    })

    const avgMood =
      responses.length > 0
        ? responses.reduce((sum, r) => sum + r.moodScore, 0) / responses.length
        : null
    const avgWellbeing =
      responses.length > 0
        ? responses.reduce((sum, r) => sum + r.wellbeing, 0) / responses.length
        : null

    return NextResponse.json({ responses, avgMood, avgWellbeing, count: responses.length })
  }

  // Étudiant : retourne sa propre réponse ou null
  const myResponse = await prisma.barometreResponse.findUnique({
    where: { sessionId_userId: { sessionId, userId: session.user.id } },
  })

  return NextResponse.json(myResponse)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { id: sessionId } = await params

  const barometreSession = await prisma.barometreSession.findUnique({ where: { id: sessionId } })
  if (!barometreSession) return NextResponse.json({ error: "Session introuvable" }, { status: 404 })
  if (barometreSession.status === "CLOSED") {
    return NextResponse.json({ error: "Cette session est fermée" }, { status: 403 })
  }

  const { moodScore, wellbeing, comment } = await req.json()

  if (
    typeof moodScore !== "number" || moodScore < 1 || moodScore > 5 ||
    typeof wellbeing !== "number" || wellbeing < 1 || wellbeing > 5
  ) {
    return NextResponse.json({ error: "moodScore et wellbeing doivent être entre 1 et 5" }, { status: 400 })
  }

  if (comment !== undefined && (typeof comment !== "string" || comment.trim().length > 1000)) {
    return NextResponse.json({ error: "Le commentaire ne peut pas dépasser 1000 caractères." }, { status: 400 })
  }

  // Explicit pre-check instead of relying on P2002 error-code parsing
  const existing = await prisma.barometreResponse.findUnique({
    where: { sessionId_userId: { sessionId, userId: session.user.id } },
  })
  if (existing) {
    return NextResponse.json({ error: "Vous avez déjà répondu à cette session" }, { status: 409 })
  }

  const response = await prisma.barometreResponse.create({
    data: {
      sessionId,
      userId: session.user.id,
      moodScore,
      wellbeing,
      comment: comment?.trim() || null,
    },
  })
  return NextResponse.json(response, { status: 201 })
}
