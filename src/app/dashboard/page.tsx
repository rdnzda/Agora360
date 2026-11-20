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
    <div className="p-4 md:p-8 lg:p-10 space-y-8 max-w-6xl">
      {/* ── Welcome header ── */}
      <FadeIn>
        <div className="pt-2 pb-6 border-b border-border flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
          <p className="text-sm text-muted-foreground first-letter:uppercase">{today}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1 text-foreground">
            Bonjour, {firstName}
          </h1>
          <p className="text-base text-muted-foreground mt-2">
            {isAdmin
              ? "Vous voyez les statistiques de toute la plateforme."
              : "Bienvenue sur votre espace de gouvernance participative."}
          </p>
          </div>
          <nav aria-label="Actions rapides">
            <QuickActions isAdmin={isAdmin} />
          </nav>
        </div>
      </FadeIn>

      {/* ── Stat cards ── */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StaggerItem>
          <StatCard
            icon={<Ticket className="w-5 h-5" />}
            label="Tickets ouverts"
            value={isAdmin ? openCount : openCount + inProgressCount}
            sublabel={isAdmin ? `${inProgressCount} en cours` : "en attente"}
            variant="primary"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={<BarChart2 className="w-5 h-5" />}
            label="Baromètre"
            value={barometreCount}
            sublabel={isAdmin ? "réponses totales" : "réponses"}
            variant="amber"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={<Wallet className="w-5 h-5" />}
            label="Budget voté"
            value={budgetVoteCount}
            sublabel={isAdmin ? "votes au total" : "votes"}
            variant="teal"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={<Landmark className="w-5 h-5" />}
            label="Parlement"
            value={parlementCount}
            sublabel="candidatures"
            variant="violet"
          />
        </StaggerItem>
      </StaggerList>

      {/* ── Admin stats ── */}
      {isAdmin && (
        <div>
          <AdminStats
            totalUsers={totalUsers as number}
            statusCounts={{
              OPEN:        openCount,
              IN_PROGRESS: inProgressCount,
              RESOLVED:    resolvedCount,
              CLOSED:      closedCount,
            }}
          />
        </div>
      )}

      {/* ── Recent tickets ── */}
      <div>
        <section className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-primary" aria-hidden="true" />
              <h2 className="text-base font-bold text-foreground">
                {isAdmin ? "Derniers tickets" : "Mes derniers tickets"}
              </h2>
            </div>
            <a href="/dashboard/tickets" className="text-sm text-primary font-semibold underline underline-offset-4 hover:no-underline">
              Voir tous les tickets
            </a>
          </div>
          <RecentTickets tickets={serializedTickets} isAdmin={isAdmin} />
        </section>
      </div>
    </div>
  )
}
