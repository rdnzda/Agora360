import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { BUDGET_ENVELOPE } from "@/lib/constants"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const projects = await prisma.budgetProject.findMany({
    select: { amount: true, status: true },
  })

  const allocated = projects
    .filter((p) => ["FUNDED", "IN_PROGRESS", "COMPLETED"].includes(p.status))
    .reduce((sum, p) => sum + p.amount, 0)

  const counts = {
    PROPOSED: 0,
    ACTIVE: 0,
    FUNDED: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    REJECTED: 0,
  } as Record<string, number>

  projects.forEach((p) => {
    counts[p.status] = (counts[p.status] ?? 0) + 1
  })

  return NextResponse.json({
    envelope: BUDGET_ENVELOPE,
    allocated,
    remaining: BUDGET_ENVELOPE - allocated,
    counts,
    total: projects.length,
  })
}
