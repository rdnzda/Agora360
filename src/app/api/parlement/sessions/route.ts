import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const isAdmin = session.user.role === "ADMIN"

  if (isAdmin) {
    const sessions = await prisma.parlementSession.findMany({
      include: {
        _count: { select: { candidatures: true, motions: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(sessions)
  }

  // Étudiant : session active ou en candidatures
  const active = await prisma.parlementSession.findFirst({
    where: { status: { in: ["CANDIDATURES", "ACTIF"] } },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { candidatures: true, motions: true } },
    },
  })

  return NextResponse.json(active ? [active] : [])
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { monthLabel, maxSeats } = await req.json()
  if (!monthLabel?.trim()) {
    return NextResponse.json({ error: "monthLabel requis" }, { status: 400 })
  }

  const newSession = await prisma.parlementSession.create({
    data: {
      monthLabel: monthLabel.trim(),
      maxSeats: typeof maxSeats === "number" && maxSeats > 0 ? maxSeats : 5,
    },
  })

  return NextResponse.json(newSession, { status: 201 })
}
