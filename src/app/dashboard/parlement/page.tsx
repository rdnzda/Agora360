import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FadeIn, StaggerList, StaggerItem } from "@/components/animations"
import { Button } from "@/components/ui/button"
import { ParlementSessionStatusBadge } from "@/components/parlement/session-status-badge"
import { MpList } from "@/components/parlement/mp-list"
import { MotionVoteButtons } from "@/components/parlement/motion-vote-buttons"
import { DrawTriggerButton } from "@/components/parlement/draw-trigger-button"
import { CreateSessionForm } from "@/components/parlement/create-session-form"
import { Landmark, Plus } from "lucide-react"

export default async function ParlementPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const isAdmin = session.user.role === "ADMIN"
  const userId = session.user.id

  // Trouver la session courante
  const currentSession = await prisma.parlementSession.findFirst({
    where: isAdmin
      ? {}
      : { status: { in: ["CANDIDATURES", "ACTIF"] } },
    orderBy: { createdAt: "desc" },
    include: {
      candidatures: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
      },
      motions: {
        include: {
          author: { select: { name: true } },
          votes: { select: { vote: true, userId: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!currentSession) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <FadeIn>
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Parlement Éphémère</h1>
          </div>
        </FadeIn>
        <FadeIn delay={0.1} className="text-center py-16">
          <Landmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-foreground font-medium">Aucune session en cours</p>
          <p className="text-sm text-muted-foreground mt-1">Le prochain parlement sera bientôt ouvert.</p>
        </FadeIn>
        {isAdmin && (
          <FadeIn delay={0.2}>
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Créer une session</h2>
              <CreateSessionForm />
            </div>
          </FadeIn>
        )}
      </div>
    )
  }

  const mps = currentSession.candidatures.filter((c) => c.isSelected)
  const isMp = mps.some((c) => c.userId === userId)

  const motionsWithStats = currentSession.motions.map((m) => ({
    ...m,
    forCount: m.votes.filter((v) => v.vote === "FOR").length,
    againstCount: m.votes.filter((v) => v.vote === "AGAINST").length,
    abstainCount: m.votes.filter((v) => v.vote === "ABSTAIN").length,
    myVote: m.votes.find((v) => v.userId === userId)?.vote ?? null,
    votes: undefined,
  }))

  const myCandidature = currentSession.candidatures.find((c) => c.userId === userId)

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* En-tête */}
      <FadeIn>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Parlement Éphémère</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{currentSession.monthLabel}</p>
          </div>
          <ParlementSessionStatusBadge status={currentSession.status as "CANDIDATURES" | "ACTIF" | "CLOS"} />
        </div>
      </FadeIn>

      {/* Phase : CANDIDATURES */}
      {currentSession.status === "CANDIDATURES" && (
        <>
          <FadeIn delay={0.1}>
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Candidatures</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {currentSession.candidatures.length} candidat{currentSession.candidatures.length > 1 ? "s" : ""} — {currentSession.maxSeats} sièges disponibles
                  </p>
                </div>
                {!myCandidature && (
                  <Link href={`/dashboard/parlement/candidater?sessionId=${currentSession.id}`}>
                    <Button size="sm" className="gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      Candidater
                    </Button>
                  </Link>
                )}
              </div>

              {myCandidature ? (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-primary">Votre candidature est enregistrée ✓</p>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">&ldquo;{myCandidature.motivation}&rdquo;</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Rejoignez le parlement éphémère pour co-décider avec l&apos;administration ce mois-ci.
                </p>
              )}

              {isAdmin && currentSession.candidatures.length > 0 && (
                <DrawTriggerButton
                  sessionId={currentSession.id}
                  candidateCount={currentSession.candidatures.length}
                  maxSeats={currentSession.maxSeats}
                />
              )}
            </div>
          </FadeIn>
        </>
      )}

      {/* Phase : ACTIF */}
      {currentSession.status === "ACTIF" && (
        <>
          {/* MPs élus */}
          <FadeIn delay={0.1}>
            <div className="bg-card rounded-xl border border-border p-5">
              <MpList mps={mps} />
              {isMp && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-emerald-600 font-medium mb-2">🏛️ Vous êtes membre élu de ce parlement</p>
                  <Link href={`/dashboard/parlement/motions/nouvelle?sessionId=${currentSession.id}`}>
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      Proposer une motion
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Motions */}
          <div>
            <FadeIn delay={0.15}>
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Motions ({motionsWithStats.length})
              </h2>
            </FadeIn>

            {motionsWithStats.length === 0 ? (
              <FadeIn delay={0.2} className="text-center py-8 text-sm text-muted-foreground">
                Aucune motion déposée pour l&apos;instant.
              </FadeIn>
            ) : (
              <StaggerList className="space-y-3">
                {motionsWithStats.map((motion) => {
                  const total = motion.forCount + motion.againstCount + motion.abstainCount
                  const forPct = total > 0 ? Math.round((motion.forCount / total) * 100) : 0
                  return (
                    <StaggerItem key={motion.id}>
                      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{motion.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            par {motion.author.name} — {total} vote{total > 1 ? "s" : ""}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{motion.description}</p>

                        {/* Mini barre de votes */}
                        <div className="space-y-1">
                          <div className="flex h-1.5 rounded-full overflow-hidden bg-muted">
                            {total > 0 && (
                              <>
                                <div className="bg-emerald-500" style={{ width: `${forPct}%` }} />
                                <div className="bg-red-400 flex-1" />
                              </>
                            )}
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="text-emerald-600">{motion.forCount} pour</span>
                            <span className="text-red-500">{motion.againstCount} contre</span>
                            <span>{motion.abstainCount} abstention{motion.abstainCount > 1 ? "s" : ""}</span>
                          </div>
                        </div>

                        <MotionVoteButtons
                          motionId={motion.id}
                          myVote={motion.myVote as "FOR" | "AGAINST" | "ABSTAIN" | null}
                        />
                      </div>
                    </StaggerItem>
                  )
                })}
              </StaggerList>
            )}
          </div>
        </>
      )}

      {/* Phase : CLOS */}
      {currentSession.status === "CLOS" && (
        <FadeIn delay={0.1}>
          <div className="bg-muted/50 rounded-xl border border-border p-6 text-center">
            <p className="text-foreground font-medium">Session close</p>
            <p className="text-sm text-muted-foreground mt-1">
              Cette session du parlement est terminée. {mps.length} membres ont siégé, {currentSession.motions.length} motions ont été débattues.
            </p>
          </div>
        </FadeIn>
      )}

      {/* Section admin */}
      {isAdmin && (
        <FadeIn delay={0.3}>
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Administration</h2>
            <div className="flex flex-wrap gap-2">
              {currentSession.status === "CANDIDATURES" && (
                <Link href={`/dashboard/parlement/admin?sessionId=${currentSession.id}`}>
                  <Button variant="outline" size="sm">
                    Gérer les candidatures →
                  </Button>
                </Link>
              )}
              {currentSession.status !== "CLOS" && (
                <CloseSessionButton sessionId={currentSession.id} currentStatus={currentSession.status as "CANDIDATURES" | "ACTIF"} />
              )}
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium mb-3">Créer la prochaine session</p>
              <CreateSessionForm />
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  )
}

// Inline client component pour fermer/avancer la session
function CloseSessionButton({ sessionId, currentStatus }: { sessionId: string; currentStatus: "CANDIDATURES" | "ACTIF" }) {
  // Ce composant est rendu server-side mais a besoin d'un event handler
  // → on le délègue à un fichier séparé
  return (
    <Link href={`/dashboard/parlement/admin?sessionId=${sessionId}`}>
      <Button variant="outline" size="sm">
        {currentStatus === "ACTIF" ? "Clôturer la session" : "Gérer la session"}
      </Button>
    </Link>
  )
}
