"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

function CandidaterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId")

  const [motivation, setMotivation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!sessionId) { setError("Session introuvable."); return }
    if (!motivation.trim()) { setError("Veuillez saisir votre motivation."); return }

    setLoading(true)
    setError("")

    const res = await fetch(`/api/parlement/sessions/${sessionId}/candidatures`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motivation }),
    })

    if (res.status === 409) { setError("Vous avez déjà candidaté."); setLoading(false); return }
    if (!res.ok) { setError("Erreur lors de l'envoi."); setLoading(false); return }

    router.push("/dashboard/parlement")
    router.refresh()
  }

  return (
    <div className="p-4 md:p-8 max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Candidater au Parlement Éphémère</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Expliquez pourquoi vous souhaitez représenter vos camarades ce mois-ci.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Votre motivation *</label>
          <textarea
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            placeholder="Pourquoi souhaitez-vous rejoindre le parlement ? Quelles propositions aimeriez-vous porter ?"
            rows={5}
            required
            className="w-full rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm focus:outline-none focus:border-primary/60 resize-none"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Minimum 50 caractères recommandés. Soyez sincère !</p>
            <p
              className={`text-xs tabular-nums ${motivation.length >= 50 ? "text-emerald-600" : "text-muted-foreground"}`}
              aria-live="polite"
              aria-atomic="true"
            >
              {motivation.length} caractère{motivation.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Envoi…" : "Soumettre ma candidature"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()} className="flex-1">
            Retour
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function CandidaterPage() {
  return (
    <Suspense fallback={<div className="p-8">Chargement…</div>}>
      <CandidaterForm />
    </Suspense>
  )
}
