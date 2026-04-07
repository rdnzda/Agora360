import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FadeIn, StaggerList, StaggerItem } from "@/components/animations"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BadgeCard } from "@/components/profil/badge-card"
import { PointHistory } from "@/components/profil/point-history"
import { LevelIndicator } from "@/components/profil/level-indicator"
import { StatsGrid } from "@/components/profil/stats-grid"
import { Pencil, Ticket, ThumbsUp, BarChart2, Star, Landmark, FileText, Users } from "lucide-react"

// Catalogue complet des badges (icônes en JSX pour compatibilité Server → Client)
const iconCls = (earned: boolean) =>
  `w-7 h-7 ${earned ? "text-primary" : "text-muted-foreground"}`

const BADGE_CATALOG = [
  { slug: "FIRST_TICKET",    name: "Premier ticket",        description: "Soumis votre premier ticket",           Icon: Ticket },
  { slug: "FIRST_VOTE",      name: "Premier vote",          description: "Voté pour un projet du campus",         Icon: ThumbsUp },
  { slug: "FIRST_BAROMETRE", name: "Première réponse",      description: "Répondu au baromètre campus",           Icon: BarChart2 },
  { slug: "ENGAGED_STUDENT", name: "Étudiant engagé",       description: "Répondu à 3 baromètres ou plus",        Icon: Star },
  { slug: "ELECTED_MP",      name: "Député·e élu·e",        description: "Tiré·e au sort au Parlement Éphémère",  Icon: Landmark },
  { slug: "MOTION_CREATOR",  name: "Porteur de motion",     description: "Déposé une motion au parlement",        Icon: FileText },
  { slug: "ACTIVE_CITIZEN",  name: "Citoyen actif",         description: "Voté sur 5 motions ou plus",            Icon: Users },
]

export default async function ProfilPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const userId = session.user.id

  const [user, pointsAgg, earnedBadges, recentTransactions, ticketCount, barometreCount, voteCount, candidatureCount] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, role: true, createdAt: true },
      }),
      prisma.pointTransaction.aggregate({ where: { userId }, _sum: { points: true } }),
      prisma.userBadge.findMany({
        where: { userId },
        include: { badge: { select: { slug: true } } },
      }),
      prisma.pointTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.ticket.count({ where: { authorId: userId } }),
      prisma.barometreResponse.count({ where: { userId } }),
      prisma.projectVote.count({ where: { userId } }),
      prisma.parlementCandidature.count({ where: { userId } }),
    ])

  const totalPoints = pointsAgg._sum.points ?? 0
  const earnedSlugs = new Set(earnedBadges.map((ub) => ub.badge.slug))

  const serializedTransactions = recentTransactions.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
  }))

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* En-tête profil */}
      <FadeIn>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">{user?.name}</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {user?.role === "ADMIN" ? "Administration" : "Étudiant"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Membre depuis {user?.createdAt.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
            <Link href="/dashboard/profil/edit">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Pencil className="w-3.5 h-3.5" />
                Modifier
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Niveau et points */}
      <FadeIn delay={0.05}>
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Niveau & Points</h2>
          <LevelIndicator points={totalPoints} />
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Activité</h2>
          <StatsGrid stats={{ ticketCount, barometreCount, voteCount, candidatureCount }} />
        </div>
      </FadeIn>

      {/* Badges */}
      <FadeIn delay={0.15}>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Badges</h2>
            <span className="text-xs text-muted-foreground">{earnedSlugs.size}/{BADGE_CATALOG.length} obtenus</span>
          </div>
          <StaggerList className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BADGE_CATALOG.map((badge) => {
              const earned = earnedSlugs.has(badge.slug as Parameters<typeof earnedSlugs.has>[0])
              const userBadge = earnedBadges.find((ub) => ub.badge.slug === badge.slug)
              return (
                <StaggerItem key={badge.slug}>
                  <BadgeCard
                    name={badge.name}
                    description={badge.description}
                    icon={<badge.Icon className={iconCls(earned)} />}
                    earned={earned}
                    earnedAt={userBadge?.earnedAt.toISOString()}
                  />
                </StaggerItem>
              )
            })}
          </StaggerList>
        </div>
      </FadeIn>

      {/* Historique des points */}
      <FadeIn delay={0.2}>
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Historique des points</h2>
          <PointHistory transactions={serializedTransactions} />
        </div>
      </FadeIn>
    </div>
  )
}
