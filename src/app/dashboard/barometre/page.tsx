import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FadeIn } from "@/components/animations"
import { BarometreForm } from "@/components/barometre/barometre-form"
import { SessionCard } from "@/components/barometre/session-card"
import { CreateSessionForm } from "@/components/barometre/create-session-form"
import { AdminSessionActions } from "@/components/barometre/admin-session-actions"
import { Button } from "@/components/ui/button"
import { BarChart2 } from "lucide-react"

export default async function BarometrePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const isAdmin = session.user.role === "ADMIN"

  if (isAdmin) {
    // Admin : voir toutes les sessions
    const sessions = await prisma.barometreSession.findMany({
      include: { _count: { select: { responses: true } } },
      orderBy: { createdAt: "desc" },
    })

    return (
      <div className="p-4 md:p-8 space-y-6">
        <FadeIn>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Baromètre campus</h1>
          <p className="text-sm text-muted-foreground mt-1">Gérez les sessions hebdomadaires du sondage.</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Nouvelle session</h2>
            <CreateSessionForm />
          </div>
        </FadeIn>

        {sessions.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Sessions</h2>
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <SessionCard
                    id={s.id}
                    weekLabel={s.weekLabel}
                    status={s.status}
                    responseCount={s._count.responses}
                    isAdmin
                  />
                  <AdminSessionActions
                    sessionId={s.id}
                    currentStatus={s.status}
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    )
  }

  // Étudiant : trouver la session ouverte
  const openSession = await prisma.barometreSession.findFirst({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
  })

  // Vérifier si l'étudiant a déjà répondu
  const myResponse = openSession
    ? await prisma.barometreResponse.findUnique({
        where: { sessionId_userId: { sessionId: openSession.id, userId: session.user.id } },
      })
    : null

  // Résultats agrégés si l'étudiant a répondu
  const sessionStats =
    myResponse && openSession
      ? await prisma.barometreResponse.aggregate({
          where: { sessionId: openSession.id },
          _avg: { moodScore: true, wellbeing: true },
          _count: true,
        })
      : null

  if (!openSession) {
    return (
      <div className="p-4 md:p-8">
        <FadeIn>
          <div className="text-center py-20">
            <BarChart2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <h1 className="text-xl font-bold text-foreground">Aucune session active</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Revenez la semaine prochaine pour répondre au baromètre campus.
            </p>
          </div>
        </FadeIn>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <FadeIn>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Baromètre campus</h1>
        <p className="text-sm text-muted-foreground mt-1">{openSession.weekLabel}</p>
      </FadeIn>

      {myResponse ? (
        // Déjà répondu → afficher les résultats
        <FadeIn delay={0.1}>
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-foreground">Merci pour votre réponse !</p>
                <p className="text-xs text-muted-foreground">Voici les résultats agrégés de cette semaine</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-foreground">
                  {sessionStats?._avg.moodScore?.toFixed(1) ?? "—"}
                  <span className="text-lg">/5</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Humeur moyenne</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-foreground">
                  {sessionStats?._avg.wellbeing?.toFixed(1) ?? "—"}
                  <span className="text-lg">/5</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Bien-être moyen</p>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Basé sur {sessionStats?._count ?? 0} réponse{(sessionStats?._count ?? 0) > 1 ? "s" : ""}
            </p>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground font-medium">Votre réponse</p>
              <p className="text-sm mt-1">Humeur : {myResponse.moodScore}/5 — Bien-être : {myResponse.wellbeing}/5</p>
              {myResponse.comment && (
                <p className="text-sm text-muted-foreground mt-1 italic">&ldquo;{myResponse.comment}&rdquo;</p>
              )}
            </div>

            <Link href={`/dashboard/barometre/resultats/${openSession.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                Voir les résultats complets →
              </Button>
            </Link>
          </div>
        </FadeIn>
      ) : (
        // Pas encore répondu → afficher le formulaire
        <FadeIn delay={0.1}>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-6">
              Prenez 30 secondes pour partager votre ressenti. Vos réponses sont anonymisées.
            </p>
            <BarometreForm sessionId={openSession.id} />
          </div>
        </FadeIn>
      )}
    </div>
  )
}
