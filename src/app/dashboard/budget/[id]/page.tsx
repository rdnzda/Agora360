import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { FadeIn } from "@/components/animations"
import { ProjectStatusBadge } from "@/components/budget/status-badge"
import { VoteBar } from "@/components/budget/vote-bar"
import { VoteButtons } from "@/components/budget/vote-buttons"
import { AdminProjectActions } from "@/components/budget/admin-project-actions"

function formatEur(n: number) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
}

const categoryLabels: Record<string, string> = {
  INFRASTRUCTURE: "Infrastructure",
  CULTURE: "Culture",
  SPORT: "Sport",
  NUMERIQUE: "Numérique",
  AUTRE: "Autre",
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params
  const isAdmin = session.user.role === "ADMIN"

  const project = await prisma.budgetProject.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true } },
      votes: { select: { vote: true, userId: true } },
    },
  })

  if (!project) redirect("/dashboard/budget")

  const forCount = project.votes.filter((v) => v.vote === "FOR").length
  const againstCount = project.votes.filter((v) => v.vote === "AGAINST").length
  const myVote = project.votes.find((v) => v.userId === session.user.id)?.vote ?? null

  return (
    <div className="p-4 md:p-8 space-y-5">
      <FadeIn>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{project.title}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {categoryLabels[project.category]} — {formatEur(project.amount)}
            </p>
          </div>
          <ProjectStatusBadge status={project.status as "PROPOSED" | "ACTIVE" | "FUNDED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED"} />
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">{project.description}</p>
          <p className="text-xs text-muted-foreground">Créé par {project.createdBy.name}</p>
        </div>
      </FadeIn>

      {/* Résultats du vote */}
      <FadeIn delay={0.1}>
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Résultats du vote</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-emerald-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-emerald-700">{forCount}</p>
              <p className="text-xs text-emerald-600 mt-0.5">Pour</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-red-600">{againstCount}</p>
              <p className="text-xs text-red-500 mt-0.5">Contre</p>
            </div>
          </div>
          <VoteBar forCount={forCount} againstCount={againstCount} />

          {project.status === "ACTIVE" && (
            <div className="pt-1">
              {myVote ? (
                <p className="text-xs text-muted-foreground mb-2">
                  Votre vote actuel : <span className="font-medium">{myVote === "FOR" ? "Pour" : "Contre"}</span> — vous pouvez le changer.
                </p>
              ) : null}
              <VoteButtons projectId={project.id} myVote={myVote as "FOR" | "AGAINST" | null} />
            </div>
          )}
        </div>
      </FadeIn>

      {/* Actions admin */}
      {isAdmin && (
        <FadeIn delay={0.15}>
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Gestion du statut</h2>
            <AdminProjectActions
              projectId={project.id}
              currentStatus={project.status as "PROPOSED" | "ACTIVE" | "FUNDED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED"}
            />
          </div>
        </FadeIn>
      )}
    </div>
  )
}
