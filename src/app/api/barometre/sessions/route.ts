import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const isAdmin = session.user.role === "ADMIN"

  if (isAdmin) {
    const sessions = await prisma.barometreSession.findMany({
      include: { _count: { select: { responses: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(sessions)
  }

  // Étudiant : retourne uniquement la session OPEN en cours
  const current = await prisma.barometreSession.findFirst({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(current ? [current] : [])
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { weekLabel } = await req.json()
  if (!weekLabel?.trim()) {
    return NextResponse.json({ error: "weekLabel requis" }, { status: 400 })
  }

  const newSession = await prisma.barometreSession.create({
    data: { weekLabel: weekLabel.trim() },
  })

  return NextResponse.json(newSession, { status: 201 })
}
