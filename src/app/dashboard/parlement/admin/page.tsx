import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FadeIn, StaggerList, StaggerItem } from "@/components/animations"
import { Button } from "@/components/ui/button"
import { ParlementSessionStatusBadge } from "@/components/parlement/session-status-badge"
import { DrawTriggerButton } from "@/components/parlement/draw-trigger-button"
import { SessionAdvanceButton } from "@/components/parlement/session-advance-button"
import { Users, ChevronLeft } from "lucide-react"

type Props = {
  searchParams: Promise<{ sessionId?: string }>
}

export default async function ParlementAdminPage({ searchParams }: Props) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard/parlement")

  const { sessionId } = await searchParams

  if (!sessionId) redirect("/dashboard/parlement")

  const parlSession = await prisma.parlementSession.findUnique({
    where: { id: sessionId },
    include: {
      candidatures: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      },
      motions: {
        include: {
          author: { select: { name: true } },
          votes: { select: { vote: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!parlSession) redirect("/dashboard/parlement")

  const mps = parlSession.candidatures.filter((c) => c.isSelected)
  const candidates = parlSession.candidatures.filter((c) => !c.isSelected)

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <FadeIn>
        <Link href="/dashboard/parlement" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-1">
          <ChevronLeft className="w-4 h-4" />
          Retour au parlement
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              Administration — {parlSession.monthLabel}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {parlSession.candidatures.length} candidature(s) · {parlSession.maxSeats} sièges
            </p>
          </div>
          <ParlementSessionStatusBadge status={parlSession.status as "CANDIDATURES" | "ACTIF" | "CLOS"} />
        </div>
      </FadeIn>

      {/* Avancer / Clôturer la session */}
      {parlSession.status !== "CLOS" && (
        <FadeIn delay={0.05}>
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Gestion de la session</h2>
            <p className="text-xs text-muted-foreground">
              {parlSession.status === "CANDIDATURES"
                ? "Lancer le tirage au sort puis passer en phase active. Les étudiants pourront alors voter sur les motions."
                : "Clôturer définitivement cette session. Les votes ne seront plus acceptés."}
            </p>
            <div className="flex flex-wrap gap-3 items-start">
              {parlSession.status === "CANDIDATURES" && (
                <DrawTriggerButton
                  sessionId={parlSession.id}
                  candidateCount={parlSession.candidatures.length}
                  maxSeats={parlSession.maxSeats}
                />
              )}
              <SessionAdvanceButton
                sessionId={parlSession.id}
                currentStatus={parlSession.status as "CANDIDATURES" | "ACTIF"}
              />
            </div>
          </div>
        </FadeIn>
      )}

      {/* Candidatures en attente */}
      {parlSession.status === "CANDIDATURES" && (
        <FadeIn delay={0.1}>
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Candidatures ({parlSession.candidatures.length})
              </h2>
            </div>
            {parlSession.candidatures.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune candidature reçue.</p>
            ) : (
              <StaggerList className="space-y-3">
                {parlSession.candidatures.map((c) => (
                  <StaggerItem key={c.id}>
                    <div className="rounded-lg border border-border p-3 space-y-1">
                      <p className="text-sm font-medium text-foreground">{c.user.name}</p>
                      <p className="text-xs text-muted-foreground">{c.user.email}</p>
                      <p className="text-sm text-foreground/80 italic mt-1">&ldquo;{c.motivation}&rdquo;</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerList>
            )}
          </div>
        </FadeIn>
      )}

      {/* Membres élus */}
      {mps.length > 0 && (
        <FadeIn delay={0.15}>
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              Membres élus ({mps.length})
            </h2>
            <StaggerList className="space-y-2">
              {mps.map((mp) => (
                <StaggerItem key={mp.id}>
                  <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                      {mp.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{mp.user.name}</p>
                      <p className="text-xs text-muted-foreground">{mp.user.email}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerList>
          </div>
        </FadeIn>
      )}

      {/* Motions */}
      {parlSession.motions.length > 0 && (
        <FadeIn delay={0.2}>
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              Motions ({parlSession.motions.length})
            </h2>
            <StaggerList className="space-y-3">
              {parlSession.motions.map((motion) => {
                const forCount = motion.votes.filter((v) => v.vote === "FOR").length
                const againstCount = motion.votes.filter((v) => v.vote === "AGAINST").length
                const abstainCount = motion.votes.filter((v) => v.vote === "ABSTAIN").length
                const total = forCount + againstCount + abstainCount
                return (
                  <StaggerItem key={motion.id}>
                    <div className="rounded-lg border border-border p-3 space-y-2">
                      <p className="text-sm font-semibold text-foreground">{motion.title}</p>
                      <p className="text-xs text-muted-foreground">par {motion.author.name}</p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-emerald-600">{forCount} pour</span>
                        <span className="text-red-500">{againstCount} contre</span>
                        <span className="text-muted-foreground">{abstainCount} abstention{abstainCount > 1 ? "s" : ""}</span>
                        <span className="text-muted-foreground ml-auto">{total} vote{total > 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </StaggerItem>
                )
              })}
            </StaggerList>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
