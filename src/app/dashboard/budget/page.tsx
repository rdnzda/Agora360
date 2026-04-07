import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FadeIn, StaggerList, StaggerItem } from "@/components/animations"
import { Button } from "@/components/ui/button"
import { ProjectStatusBadge } from "@/components/budget/status-badge"
import { VoteBar } from "@/components/budget/vote-bar"
import { VoteButtons } from "@/components/budget/vote-buttons"
import { BudgetOverviewBar } from "@/components/budget/budget-overview-bar"
import { BUDGET_ENVELOPE } from "@/lib/constants"
import { Plus, Wallet } from "lucide-react"

function formatEur(n: number) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
}

export default async function BudgetPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const isAdmin = session.user.role === "ADMIN"
  const userId = session.user.id

  const projects = await prisma.budgetProject.findMany({
    include: {
      votes: { select: { vote: true, userId: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const projectsWithStats = projects.map((p) => {
    const forCount = p.votes.filter((v) => v.vote === "FOR").length
    const againstCount = p.votes.filter((v) => v.vote === "AGAINST").length
    const myVote = p.votes.find((v) => v.userId === userId)?.vote ?? null
    return { ...p, forCount, againstCount, myVote, votes: undefined }
  })

  const allocated = projects
    .filter((p) => ["FUNDED", "IN_PROGRESS", "COMPLETED"].includes(p.status))
    .reduce((sum, p) => sum + p.amount, 0)

  if (projects.length === 0) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <FadeIn>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">Budget Participatif</h1>
              <p className="text-sm text-muted-foreground mt-1">Votez pour les projets qui comptent pour vous.</p>
            </div>
            {isAdmin && (
              <Link href="/dashboard/budget/nouveau">
                <Button size="sm" className="gap-2"><Plus className="w-4 h-4" />Nouveau projet</Button>
              </Link>
            )}
          </div>
        </FadeIn>
        <FadeIn delay={0.1} className="text-center py-16">
          <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-foreground font-medium">Aucun projet pour l&apos;instant</p>
          {isAdmin && (
            <Link href="/dashboard/budget/nouveau">
              <Button variant="outline" className="mt-4">Créer le premier projet</Button>
            </Link>
          )}
        </FadeIn>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Budget Participatif</h1>
            <p className="text-sm text-muted-foreground mt-1">Votez pour les projets qui comptent pour vous.</p>
          </div>
          {isAdmin && (
            <Link href="/dashboard/budget/nouveau">
              <Button size="sm" className="gap-2"><Plus className="w-4 h-4" />Nouveau projet</Button>
            </Link>
          )}
        </div>
      </FadeIn>

      {/* Overview budgétaire */}
      <FadeIn delay={0.05}>
        <BudgetOverviewBar
          envelope={BUDGET_ENVELOPE}
          allocated={allocated}
          remaining={BUDGET_ENVELOPE - allocated}
        />
      </FadeIn>

      {/* Liste des projets */}
      <StaggerList className="space-y-3">
        {projectsWithStats.map((project) => (
          <StaggerItem key={project.id}>
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{project.title}</h3>
                    <ProjectStatusBadge status={project.status as "PROPOSED" | "ACTIVE" | "FUNDED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED"} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{project.category} — {formatEur(project.amount)}</p>
                </div>
                <Link href={`/dashboard/budget/${project.id}`}>
                  <Button variant="ghost" size="sm">Voir →</Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

              <VoteBar forCount={project.forCount} againstCount={project.againstCount} />

              {project.status === "ACTIVE" && (
                <VoteButtons projectId={project.id} myVote={project.myVote as "FOR" | "AGAINST" | null} />
              )}
            </div>
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  )
}
