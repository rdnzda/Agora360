import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { id: projectId } = await params
  const { vote } = await req.json()

  if (vote !== "FOR" && vote !== "AGAINST") {
    return NextResponse.json({ error: "vote doit être FOR ou AGAINST" }, { status: 400 })
  }

  const project = await prisma.budgetProject.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 })
  if (project.status !== "ACTIVE") {
    return NextResponse.json({ error: "Ce projet n'est pas ouvert au vote" }, { status: 403 })
  }

  // Upsert : permet de changer son vote
  const result = await prisma.projectVote.upsert({
    where: { projectId_userId: { projectId, userId: session.user.id } },
    create: { projectId, userId: session.user.id, vote },
    update: { vote },
  })

  return NextResponse.json(result)
}
