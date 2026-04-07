import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const [user, pointsAgg, badges, recentTransactions, stats] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
    prisma.pointTransaction.aggregate({ where: { userId: session.user.id }, _sum: { points: true } }),
    prisma.userBadge.findMany({
      where: { userId: session.user.id },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    }),
    prisma.pointTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    Promise.all([
      prisma.ticket.count({ where: { authorId: session.user.id } }),
      prisma.barometreResponse.count({ where: { userId: session.user.id } }),
      prisma.projectVote.count({ where: { userId: session.user.id } }),
      prisma.parlementCandidature.count({ where: { userId: session.user.id } }),
    ]),
  ])

  const [ticketCount, barometreCount, voteCount, candidatureCount] = stats
  const totalPoints = pointsAgg._sum.points ?? 0

  return NextResponse.json({
    user: { ...user, createdAt: user?.createdAt.toISOString() },
    totalPoints,
    badges,
    recentTransactions,
    stats: { ticketCount, barometreCount, voteCount, candidatureCount },
  })
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: "Nom invalide" }, { status: 400 })

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true },
  })

  return NextResponse.json(updated)
}
