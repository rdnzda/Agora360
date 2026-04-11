import { getSession } from "@/lib/get-session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Ticket, BarChart2, Wallet, Landmark } from "lucide-react"
import { FadeIn, StaggerList, StaggerItem } from "@/components/animations"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentTickets } from "@/components/dashboard/recent-tickets"
import { AdminStats } from "@/components/dashboard/admin-stats"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const isAdmin = session.user.role === "ADMIN"

  const [tickets, totalUsers, barometreCount, budgetVoteCount, parlementCount] = await Promise.all([
    prisma.ticket.findMany({
      where: isAdmin ? {} : { authorId: session.user.id },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: isAdmin ? 8 : 5,
    }),
    isAdmin ? prisma.user.count() : Promise.resolve(0),
    isAdmin
      ? prisma.barometreResponse.count()
      : prisma.barometreResponse.count({ where: { userId: session.user.id } }),
    isAdmin
      ? prisma.projectVote.count()
      : prisma.projectVote.count({ where: { userId: session.user.id } }),
    isAdmin
      ? prisma.parlementCandidature.count()
      : prisma.parlementCandidature.count({ where: { userId: session.user.id } }),
  ])

  const serializedTickets = tickets.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
  }))

  const openCount       = tickets.filter((t) => t.status === "OPEN").length
  const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length
  const resolvedCount   = tickets.filter((t) => t.status === "RESOLVED").length
  const closedCount     = tickets.filter((t) => t.status === "CLOSED").length

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const firstName = session.user.name?.split(" ")[0] ?? "vous"

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* ── Welcome header ── */}
      <FadeIn>
        <div className="pt-2 pb-1">
          <p className="text-xs text-muted-foreground capitalize font-medium tracking-wide">{today}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1 text-foreground">
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin
              ? "Vue administrateur — toutes les statistiques de la plateforme."
              : "Bienvenue sur votre espace de gouvernance participative."}
          </p>
        </div>
      </FadeIn>

      {/* ── Stat cards ── */}
      <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StaggerItem>
          <StatCard
            icon={<Ticket className="w-5 h-5 text-primary" />}
            label="Tickets ouverts"
            value={isAdmin ? openCount : openCount + inProgressCount}
            sublabel={isAdmin ? `${inProgressCount} en cours` : "en attente"}
            variant="primary"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={<BarChart2 className="w-5 h-5 text-accent" />}
            label="Baromètre"
            value={barometreCount}
            sublabel={isAdmin ? "réponses totales" : "réponses"}
            variant="teal"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={<Wallet className="w-5 h-5 text-[oklch(0.60_0.19_47)]" />}
            label="Budget voté"
            value={budgetVoteCount}
            sublabel={isAdmin ? "votes au total" : "votes"}
            variant="amber"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={<Landmark className="w-5 h-5 text-[oklch(0.50_0.20_310)]" />}
            label="Parlement"
            value={parlementCount}
            sublabel="candidatures"
            variant="violet"
          />
        </StaggerItem>
      </StaggerList>

      {/* ── Quick actions ── */}
      <FadeIn delay={0.15}>
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-accent" />
            <h2 className="text-sm font-bold text-foreground">Actions rapides</h2>
          </div>
          <QuickActions isAdmin={isAdmin} />
        </div>
      </FadeIn>

      {/* ── Admin stats ── */}
      {isAdmin && (
        <FadeIn delay={0.2}>
          <AdminStats
            totalUsers={totalUsers as number}
            statusCounts={{
              OPEN:        openCount,
              IN_PROGRESS: inProgressCount,
              RESOLVED:    resolvedCount,
              CLOSED:      closedCount,
            }}
          />
        </FadeIn>
      )}

      {/* ── Recent tickets ── */}
      <FadeIn delay={0.25}>
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-accent" />
              <h2 className="text-sm font-bold text-foreground">
                {isAdmin ? "Derniers tickets" : "Mes derniers tickets"}
              </h2>
            </div>
            <a href="/dashboard/tickets" className="text-xs text-accent hover:text-accent/80 font-medium transition-colors">
              Voir tout →
            </a>
          </div>
          <RecentTickets tickets={serializedTickets} isAdmin={isAdmin} />
        </div>
      </FadeIn>
    </div>
  )
}
