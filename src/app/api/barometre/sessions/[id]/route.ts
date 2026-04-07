import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

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

  if (status !== "OPEN" && status !== "CLOSED") {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
  }

  const updated = await prisma.barometreSession.update({
    where: { id },
    data: {
      status,
      closedAt: status === "CLOSED" ? new Date() : null,
    },
  })

  return NextResponse.json(updated)
}
