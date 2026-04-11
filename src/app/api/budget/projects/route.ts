import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  // Single query for projects + current user's vote
  const projects = await prisma.budgetProject.findMany({
    include: {
      _count: { select: { votes: true } },
      votes: {
        where: { userId: session.user.id },
        select: { vote: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Single aggregation query instead of 2 × N per-project count queries
  const voteCounts = await prisma.projectVote.groupBy({
    by: ["projectId", "vote"],
    _count: { vote: true },
  })

  const voteMap = new Map<string, { FOR: number; AGAINST: number }>()
  for (const row of voteCounts) {
    if (!voteMap.has(row.projectId)) voteMap.set(row.projectId, { FOR: 0, AGAINST: 0 })
    const entry = voteMap.get(row.projectId)!
    if (row.vote === "FOR" || row.vote === "AGAINST") entry[row.vote] = row._count.vote
  }

  const projectsWithCounts = projects.map((p) => {
    const counts = voteMap.get(p.id) ?? { FOR: 0, AGAINST: 0 }
    return {
      ...p,
      forCount: counts.FOR,
      againstCount: counts.AGAINST,
      myVote: p.votes[0]?.vote ?? null,
      votes: undefined,
    }
  })

  return NextResponse.json(projectsWithCounts)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { title, description, amount, category } = await req.json()

  if (!title?.trim() || !description?.trim() || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "Champs invalides" }, { status: 400 })
  }

  const validCategories = ["INFRASTRUCTURE", "CULTURE", "SPORT", "NUMERIQUE", "AUTRE"]
  const cat = validCategories.includes(category) ? category : "AUTRE"

  const project = await prisma.budgetProject.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      amount,
      category: cat,
      createdById: session.user.id,
    },
  })

  return NextResponse.json(project, { status: 201 })
}
