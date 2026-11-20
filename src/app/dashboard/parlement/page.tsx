import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FadeIn, StaggerList, StaggerItem } from "@/components/animations"
import { ParlementSessionStatusBadge } from "@/components/parlement/session-status-badge"
import { MpList } from "@/components/parlement/mp-list"
import { MotionVoteButtons } from "@/components/parlement/motion-vote-buttons"
import { DrawTriggerButton } from "@/components/parlement/draw-trigger-button"
import { CreateSessionForm } from "@/components/parlement/create-session-form"
import { SessionAdvanceButton } from "@/components/parlement/session-advance-button"
import {
  Landmark, Plus, Users, FileText, Settings,
  CheckCircle2, MessageSquare, ChevronRight,
} from "lucide-react"

export default async function ParlementPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const isAdmin = session.user.role === "ADMIN"
  const userId = session.user.id

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

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!currentSession) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <FadeIn>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Parlement Éphémère</h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
              <Landmark className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="font-semibold text-foreground">Aucune session en cours</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Le prochain parlement éphémère sera bientôt ouvert par l&apos;administration.
            </p>
          </div>
        </FadeIn>

        {isAdmin && (
          <FadeIn delay={0.2}>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Landmark className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Créer une session</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Lancez le prochain parlement mensuel.</p>
                </div>
              </div>
              <div className="p-5">
                <CreateSessionForm />
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    )
  }

  const mps = currentSession.candidatures.filter((c) => c.isSelected)
  const isMp = mps.some((c) => c.userId === userId)
  const myCandidature = currentSession.candidatures.find((c) => c.userId === userId)

  const motionsWithStats = currentSession.motions.map((m) => ({
    ...m,
    forCount: m.votes.filter((v) => v.vote === "FOR").length,
    againstCount: m.votes.filter((v) => v.vote === "AGAINST").length,
    abstainCount: m.votes.filter((v) => v.vote === "ABSTAIN").length,
    myVote: m.votes.find((v) => v.userId === userId)?.vote ?? null,
    votes: undefined,
  }))

  return (
    <div className="p-4 md:p-8 space-y-6">

      {/* ── Header ── */}
      <FadeIn>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Parlement Éphémère</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{currentSession.monthLabel}</p>
          </div>
          <ParlementSessionStatusBadge status={currentSession.status as "CANDIDATURES" | "ACTIF" | "CLOS"} />
        </div>
      </FadeIn>

      {/* ── Phase : CANDIDATURES ── */}
      {currentSession.status === "CANDIDATURES" && (
        <FadeIn delay={0.1}>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Candidatures</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {currentSession.candidatures.length} candidat{currentSession.candidatures.length !== 1 ? "s" : ""} · {currentSession.maxSeats} sièges
                  </p>
                </div>
              </div>
              {!myCandidature && (
                <Link
                  href={`/dashboard/parlement/candidater?sessionId=${currentSession.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Candidater
                </Link>
              )}
            </div>

            <div className="p-5 space-y-4">
              {myCandidature ? (
                <div className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary">Votre candidature est enregistrée</p>
                    <p className="text-xs text-muted-foreground mt-0.5 italic">&ldquo;{myCandidature.motivation}&rdquo;</p>
                  </div>
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
          </div>
        </FadeIn>
      )}

      {/* ── Phase : ACTIF ── */}
      {currentSession.status === "ACTIF" && (
        <>
          {/* MPs */}
          <FadeIn delay={0.1}>
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <MpList mps={mps} />
              {isMp && (
                <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <Landmark className="w-3.5 h-3.5" />
                    Vous êtes membre élu de ce parlement
                  </div>
                  <Link
                    href={`/dashboard/parlement/motions/nouvelle?sessionId=${currentSession.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Proposer une motion
                  </Link>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Motions */}
          <FadeIn delay={0.15}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-primary" aria-hidden="true" />
                <h2 className="text-base font-bold text-foreground">
                  Motions
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({motionsWithStats.length})
                  </span>
                </h2>
              </div>
            </div>
          </FadeIn>

          {motionsWithStats.length === 0 ? (
            <FadeIn delay={0.2}>
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border">
                <FileText className="w-8 h-8 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-foreground">Aucune motion déposée</p>
                <p className="text-xs text-muted-foreground mt-1">Les membres élus peuvent proposer des motions.</p>
              </div>
            </FadeIn>
          ) : (
            <StaggerList className="space-y-3">
              {motionsWithStats.map((motion) => {
                const total = motion.forCount + motion.againstCount + motion.abstainCount
                const forPct  = total > 0 ? (motion.forCount  / total) * 100 : 0
                const agaPct  = total > 0 ? (motion.againstCount / total) * 100 : 0
                return (
                  <StaggerItem key={motion.id}>
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="p-5 space-y-4">
                        {/* Title + meta */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-foreground leading-snug">{motion.title}</h3>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                              <MessageSquare className="w-3 h-3" />
                              <span>par {motion.author.name}</span>
                              <span>·</span>
                              <span>{total} vote{total !== 1 ? "s" : ""}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">{motion.description}</p>

                        {/* Vote bar */}
                        <div className="space-y-2">
                          <div className="flex h-2 rounded-full overflow-hidden bg-muted gap-px">
                            {total > 0 ? (
                              <>
                                <div
                                  className="bg-emerald-500 rounded-l-full transition-all duration-500"
                                  style={{ width: `${forPct}%` }}
                                />
                                <div
                                  className="bg-red-400 rounded-r-full transition-all duration-500"
                                  style={{ width: `${agaPct}%` }}
                                />
                              </>
                            ) : (
                              <div className="w-full bg-muted rounded-full" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1 text-emerald-600 font-medium">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                              {motion.forCount} pour
                            </span>
                            <span className="flex items-center gap-1 text-red-500 font-medium">
                              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                              {motion.againstCount} contre
                            </span>
                            <span className="text-muted-foreground">
                              {motion.abstainCount} abstention{motion.abstainCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        <MotionVoteButtons
                          motionId={motion.id}
                          myVote={motion.myVote as "FOR" | "AGAINST" | "ABSTAIN" | null}
                        />
                      </div>
                    </div>
                  </StaggerItem>
                )
              })}
            </StaggerList>
          )}
        </>
      )}

      {/* ── Phase : CLOS ── */}
      {currentSession.status === "CLOS" && (
        <FadeIn delay={0.1}>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-muted/40 px-6 py-8 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                <Landmark className="w-6 h-6 text-muted-foreground/60" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Session close</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Cette session est terminée.
                </p>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-6 mt-1">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{mps.length}</p>
                  <p className="text-xs text-muted-foreground">membre{mps.length !== 1 ? "s" : ""} élu{mps.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{currentSession.motions.length}</p>
                  <p className="text-xs text-muted-foreground">motion{currentSession.motions.length !== 1 ? "s" : ""} débattue{currentSession.motions.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* ── Admin panel ── */}
      {isAdmin && (
        <FadeIn delay={0.3}>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Administration</h2>
            </div>

            <div className="p-5 space-y-4">
              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {currentSession.status === "CANDIDATURES" && (
                  <Link
                    href={`/dashboard/parlement/admin?sessionId=${currentSession.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Gérer les candidatures
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {currentSession.status !== "CLOS" && (
                  <SessionAdvanceButton
                    sessionId={currentSession.id}
                    currentStatus={currentSession.status as "CANDIDATURES" | "ACTIF"}
                  />
                )}
              </div>

              {/* Next session form */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-xs font-medium text-muted-foreground">Créer la prochaine session</p>
                <CreateSessionForm />
              </div>
            </div>
          </div>
        </FadeIn>
      )}

    </div>
  )
}
