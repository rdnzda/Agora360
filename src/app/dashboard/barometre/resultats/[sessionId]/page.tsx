import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { FadeIn } from "@/components/animations"
import { Badge } from "@/components/ui/badge"
import { BarometreChartWrapper } from "@/components/barometre/barometre-chart-wrapper"

export default async function ResultatsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const { sessionId } = await params

  // L'étudiant doit avoir répondu pour voir les résultats
  const myResponse = await prisma.barometreResponse.findUnique({
    where: { sessionId_userId: { sessionId, userId: session.user.id } },
  })

  if (!myResponse && session.user.role !== "ADMIN") redirect("/dashboard/barometre")

  const barometreSession = await prisma.barometreSession.findUnique({
    where: { id: sessionId },
    include: { _count: { select: { responses: true } } },
  })
  if (!barometreSession) redirect("/dashboard/barometre")

  const [stats, allSessions] = await Promise.all([
    prisma.barometreResponse.aggregate({
      where: { sessionId },
      _avg: { moodScore: true, wellbeing: true },
      _count: true,
    }),
    // Données historiques pour le graphique (toutes sessions fermées + celle-ci)
    prisma.barometreSession.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        responses: { select: { moodScore: true, wellbeing: true } },
      },
    }),
  ])

  const chartData = allSessions.map((s) => {
    const count = s.responses.length
    return {
      weekLabel: s.weekLabel,
      avgMood: count > 0 ? s.responses.reduce((sum, r) => sum + r.moodScore, 0) / count : null,
      avgWellbeing: count > 0 ? s.responses.reduce((sum, r) => sum + r.wellbeing, 0) / count : null,
    }
  })

  // Distribution des scores (humeur)
  const moodDist = [1, 2, 3, 4, 5].map((score) => ({
    score,
    count: 0,
  }))

  const responses = await prisma.barometreResponse.findMany({
    where: { sessionId },
    select: { moodScore: true, wellbeing: true, comment: true },
  })

  responses.forEach((r) => {
    const idx = moodDist.findIndex((d) => d.score === r.moodScore)
    if (idx !== -1) moodDist[idx].count++
  })

  const comments = responses.filter((r) => r.comment).map((r) => r.comment!)

  return (
    <div className="p-4 md:p-8 space-y-6">
      <FadeIn>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Résultats — {barometreSession.weekLabel}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{stats._count} réponse{stats._count > 1 ? "s" : ""}</p>
          </div>
          <Badge
            variant="outline"
            className={barometreSession.status === "OPEN" ? "text-emerald-700 border-emerald-300 bg-emerald-50" : ""}
          >
            {barometreSession.status === "OPEN" ? "En cours" : "Terminée"}
          </Badge>
        </div>
      </FadeIn>

      {/* Scores moyens */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <p className="text-4xl font-bold text-foreground">
              {stats._avg.moodScore?.toFixed(1) ?? "—"}<span className="text-xl text-muted-foreground">/5</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">Humeur moyenne</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <p className="text-4xl font-bold text-foreground">
              {stats._avg.wellbeing?.toFixed(1) ?? "—"}<span className="text-xl text-muted-foreground">/5</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">Bien-être moyen</p>
          </div>
        </div>
      </FadeIn>

      {/* Distribution humeur */}
      <FadeIn delay={0.15}>
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Distribution de l&apos;humeur</h2>
          <div className="space-y-2">
            {moodDist.map(({ score, count }) => {
              const pct = stats._count > 0 ? Math.round((count / stats._count) * 100) : 0
              const emojis = ["😢", "😕", "😐", "🙂", "😄"]
              return (
                <div key={score} className="flex items-center gap-3">
                  <span className="text-lg w-6">{emojis[score - 1]}</span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-14 text-right">{count} ({pct}%)</span>
                </div>
              )
            })}
          </div>
        </div>
      </FadeIn>

      {/* Graphique historique */}
      {chartData.length > 1 && (
        <FadeIn delay={0.2}>
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Évolution sur les dernières semaines</h2>
            <BarometreChartWrapper data={chartData} />
          </div>
        </FadeIn>
      )}

      {/* Commentaires */}
      {session.user.role === "ADMIN" && comments.length > 0 && (
        <FadeIn delay={0.25}>
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Commentaires ({comments.length})</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {comments.map((c, i) => (
                <p key={i} className="text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2 italic">
                  &ldquo;{c}&rdquo;
                </p>
              ))}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
