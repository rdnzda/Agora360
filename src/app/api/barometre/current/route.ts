import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const current = await prisma.barometreSession.findFirst({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { responses: true } } },
  })

  if (!current) return NextResponse.json({ session: null, hasResponded: false })

  const myResponse = await prisma.barometreResponse.findUnique({
    where: { sessionId_userId: { sessionId: current.id, userId: session.user.id } },
  })

  return NextResponse.json({ session: current, hasResponded: !!myResponse })
}
