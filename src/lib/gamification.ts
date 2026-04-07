import { type PrismaClient } from "@/generated/prisma/client"

// ─── Valeurs des points ───────────────────────────────────────────────────────

export const POINT_VALUES = {
  TICKET_SUBMITTED:    10,
  TICKET_RESOLVED:     5,
  BAROMETRE_RESPONDED: 5,
  BUDGET_VOTED:        10,
  PARLEMENT_APPLIED:   15,
  PARLEMENT_ELECTED:   50,
  MOTION_CREATED:      20,
  MOTION_VOTED:        5,
} as const

export type PointAction = keyof typeof POINT_VALUES

// ─── Labels lisibles ──────────────────────────────────────────────────────────

const POINT_LABELS: Record<PointAction, string> = {
  TICKET_SUBMITTED:    "Ticket soumis",
  TICKET_RESOLVED:     "Ticket résolu",
  BAROMETRE_RESPONDED: "Réponse au baromètre",
  BUDGET_VOTED:        "Vote sur un projet",
  PARLEMENT_APPLIED:   "Candidature au parlement",
  PARLEMENT_ELECTED:   "Élu au parlement",
  MOTION_CREATED:      "Motion déposée",
  MOTION_VOTED:        "Vote sur une motion",
}

// ─── Niveaux ──────────────────────────────────────────────────────────────────

export const LEVELS = [
  { label: "Observateur",  min: 0 },
  { label: "Citoyen",      min: 50 },
  { label: "Délégué",      min: 150 },
  { label: "Ambassadeur",  min: 350 },
]

export function getLevel(points: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].min) {
      const next = LEVELS[i + 1]
      return {
        label: LEVELS[i].label,
        current: points - LEVELS[i].min,
        next: next ? next.min - LEVELS[i].min : null,
        nextLabel: next?.label ?? null,
      }
    }
  }
  return { label: "Observateur", current: 0, next: 50, nextLabel: "Citoyen" }
}

// ─── Attribuer des points ─────────────────────────────────────────────────────

export async function awardPoints(
  userId: string,
  action: PointAction,
  prisma: PrismaClient
) {
  await prisma.pointTransaction.create({
    data: {
      userId,
      action,
      points: POINT_VALUES[action],
      label: POINT_LABELS[action],
    },
  })
}

// ─── Vérifier et attribuer des badges ────────────────────────────────────────

export async function checkAndAwardBadges(userId: string, prisma: PrismaClient) {
  const [
    ticketCount,
    voteCount,
    barometreCount,
    motionCount,
    motionVoteCount,
    electedCount,
  ] = await Promise.all([
    prisma.ticket.count({ where: { authorId: userId } }),
    prisma.projectVote.count({ where: { userId } }),
    prisma.barometreResponse.count({ where: { userId } }),
    prisma.parlementMotion.count({ where: { authorId: userId } }),
    prisma.motionVote.count({ where: { userId } }),
    prisma.parlementCandidature.count({ where: { userId, isSelected: true } }),
  ])

  const toAward: string[] = []

  if (ticketCount >= 1) toAward.push("FIRST_TICKET")
  if (voteCount >= 1) toAward.push("FIRST_VOTE")
  if (barometreCount >= 1) toAward.push("FIRST_BAROMETRE")
  if (barometreCount >= 3) toAward.push("ENGAGED_STUDENT")
  if (motionCount >= 1) toAward.push("MOTION_CREATOR")
  if (motionVoteCount >= 5) toAward.push("ACTIVE_CITIZEN")
  if (electedCount >= 1) toAward.push("ELECTED_MP")

  if (toAward.length === 0) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const badges = await prisma.badge.findMany({
    where: { slug: { in: toAward as any } },
  })

  const existing = await prisma.userBadge.findMany({
    where: { userId, badgeId: { in: badges.map((b) => b.id) } },
    select: { badgeId: true },
  })
  const existingIds = new Set(existing.map((e) => e.badgeId))

  const newBadges = badges.filter((b) => !existingIds.has(b.id))

  if (newBadges.length > 0) {
    await prisma.userBadge.createMany({
      data: newBadges.map((b) => ({ userId, badgeId: b.id })),
      skipDuplicates: true,
    })
  }
}
