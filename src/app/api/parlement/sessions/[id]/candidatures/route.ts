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
    const candidatures = await prisma.parlementCandidature.findMany({
      where: { sessionId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(candidatures)
  }

  // Étudiant : sa propre candidature
  const mine = await prisma.parlementCandidature.findUnique({
    where: { sessionId_userId: { sessionId, userId: session.user.id } },
  })

  return NextResponse.json(mine)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { id: sessionId } = await params
  const { motivation } = await req.json()

  if (!motivation?.trim()) {
    return NextResponse.json({ error: "motivation requis" }, { status: 400 })
  }

  const parlementSession = await prisma.parlementSession.findUnique({ where: { id: sessionId } })
  if (!parlementSession) return NextResponse.json({ error: "Session introuvable" }, { status: 404 })
  if (parlementSession.status !== "CANDIDATURES") {
    return NextResponse.json({ error: "Les candidatures sont fermées" }, { status: 403 })
  }

  try {
    const candidature = await prisma.parlementCandidature.create({
      data: { sessionId, userId: session.user.id, motivation: motivation.trim() },
    })
    return NextResponse.json(candidature, { status: 201 })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Vous avez déjà candidaté à cette session" }, { status: 409 })
    }
    throw err
  }
}
