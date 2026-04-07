import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { id } = await params

  const project = await prisma.budgetProject.findUnique({
    where: { id },
    include: { createdBy: { select: { name: true } } },
  })
  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 })

  const [forCount, againstCount, myVoteRecord] = await Promise.all([
    prisma.projectVote.count({ where: { projectId: id, vote: "FOR" } }),
    prisma.projectVote.count({ where: { projectId: id, vote: "AGAINST" } }),
    prisma.projectVote.findUnique({
      where: { projectId_userId: { projectId: id, userId: session.user.id } },
      select: { vote: true },
    }),
  ])

  return NextResponse.json({ ...project, forCount, againstCount, myVote: myVoteRecord?.vote ?? null })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { id } = await params
  const { status } = await req.json()

  const validStatuses = ["PROPOSED", "ACTIVE", "FUNDED", "IN_PROGRESS", "COMPLETED", "REJECTED"]
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
  }

  const updated = await prisma.budgetProject.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(updated)
}
