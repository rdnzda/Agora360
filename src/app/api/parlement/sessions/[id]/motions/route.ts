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

  const motions = await prisma.parlementMotion.findMany({
    where: { sessionId },
    include: {
      author: { select: { name: true } },
      votes: { select: { vote: true, userId: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const userId = session.user.id
  const enriched = motions.map((m) => ({
    ...m,
    forCount: m.votes.filter((v) => v.vote === "FOR").length,
    againstCount: m.votes.filter((v) => v.vote === "AGAINST").length,
    abstainCount: m.votes.filter((v) => v.vote === "ABSTAIN").length,
    myVote: m.votes.find((v) => v.userId === userId)?.vote ?? null,
    votes: undefined,
  }))

  return NextResponse.json(enriched)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { id: sessionId } = await params
  const { title, description } = await req.json()

  if (!title?.trim() || !description?.trim()) {
    return NextResponse.json({ error: "title et description requis" }, { status: 400 })
  }
  if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 200) {
    return NextResponse.json({ error: "Le titre doit contenir entre 3 et 200 caractères." }, { status: 400 })
  }
  if (typeof description !== "string" || description.trim().length > 3000) {
    return NextResponse.json({ error: "La description ne peut pas dépasser 3000 caractères." }, { status: 400 })
  }

  const parlementSession = await prisma.parlementSession.findUnique({ where: { id: sessionId } })
  if (!parlementSession || parlementSession.status !== "ACTIF") {
    return NextResponse.json({ error: "La session n'est pas active" }, { status: 403 })
  }

  // Seuls les MPs peuvent créer des motions
  if (session.user.role !== "ADMIN") {
    const isMp = await prisma.parlementCandidature.findFirst({
      where: { sessionId, userId: session.user.id, isSelected: true },
    })
    if (!isMp) {
      return NextResponse.json({ error: "Seuls les membres élus peuvent créer des motions" }, { status: 403 })
    }
  }

  const motion = await prisma.parlementMotion.create({
    data: {
      sessionId,
      authorId: session.user.id,
      title: title.trim(),
      description: description.trim(),
    },
  })

  return NextResponse.json(motion, { status: 201 })
}
