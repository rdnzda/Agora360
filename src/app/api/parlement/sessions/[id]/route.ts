import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const statusFlow = ["CANDIDATURES", "ACTIF", "CLOS"] as const

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

  if (!statusFlow.includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
  }

  const updated = await prisma.parlementSession.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(updated)
}
