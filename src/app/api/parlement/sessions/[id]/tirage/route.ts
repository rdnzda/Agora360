import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { id: sessionId } = await params

  const parlementSession = await prisma.parlementSession.findUnique({
    where: { id: sessionId },
    include: { candidatures: { select: { id: true } } },
  })

  if (!parlementSession) return NextResponse.json({ error: "Session introuvable" }, { status: 404 })
  if (parlementSession.status !== "CANDIDATURES") {
    return NextResponse.json({ error: "Le tirage n'est possible qu'en phase de candidatures" }, { status: 403 })
  }
  if (parlementSession.candidatures.length === 0) {
    return NextResponse.json({ error: "Aucune candidature enregistrée" }, { status: 400 })
  }

  const shuffled = shuffle(parlementSession.candidatures)
  const selectedIds = shuffled.slice(0, parlementSession.maxSeats).map((c) => c.id)

  // Transaction atomique : sélectionner les élus + passer la session en ACTIF
  const [, updated] = await prisma.$transaction([
    prisma.parlementCandidature.updateMany({
      where: { id: { in: selectedIds } },
      data: { isSelected: true },
    }),
    prisma.parlementSession.update({
      where: { id: sessionId },
      data: { status: "ACTIF", drawnAt: new Date() },
    }),
  ])

  return NextResponse.json({ elected: selectedIds.length, session: updated })
}
