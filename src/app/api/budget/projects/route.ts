import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

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

  // Compter FOR/AGAINST pour chaque projet
  const projectsWithCounts = await Promise.all(
    projects.map(async (p) => {
      const [forCount, againstCount] = await Promise.all([
        prisma.projectVote.count({ where: { projectId: p.id, vote: "FOR" } }),
        prisma.projectVote.count({ where: { projectId: p.id, vote: "AGAINST" } }),
      ])
      return {
        ...p,
        forCount,
        againstCount,
        myVote: p.votes[0]?.vote ?? null,
        votes: undefined,
      }
    })
  )

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
