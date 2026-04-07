import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { id: motionId } = await params
  const { vote } = await req.json()

  if (!["FOR", "AGAINST", "ABSTAIN"].includes(vote)) {
    return NextResponse.json({ error: "vote doit être FOR, AGAINST ou ABSTAIN" }, { status: 400 })
  }

  const motion = await prisma.parlementMotion.findUnique({
    where: { id: motionId },
    include: { session: { select: { status: true } } },
  })

  if (!motion) return NextResponse.json({ error: "Motion introuvable" }, { status: 404 })
  if (motion.session.status !== "ACTIF") {
    return NextResponse.json({ error: "La session n'est pas active" }, { status: 403 })
  }

  const result = await prisma.motionVote.upsert({
    where: { motionId_userId: { motionId, userId: session.user.id } },
    create: { motionId, userId: session.user.id, vote },
    update: { vote },
  })

  return NextResponse.json(result)
}
