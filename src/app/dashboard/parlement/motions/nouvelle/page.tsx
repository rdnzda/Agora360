"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

function NouvelleMotionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId")

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!sessionId) { setError("Session introuvable."); return }

    setLoading(true)
    setError("")

    const res = await fetch(`/api/parlement/sessions/${sessionId}/motions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })

    if (res.status === 403) { setError("Vous n'avez pas le droit de créer des motions."); setLoading(false); return }
    if (!res.ok) { setError("Erreur lors de la création."); setLoading(false); return }

    router.push("/dashboard/parlement")
    router.refresh()
  }

  return (
    <div className="p-4 md:p-8 max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Nouvelle motion</h1>
        <p className="text-sm text-muted-foreground mt-1">Proposez une décision à soumettre au vote de tous les étudiants.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Titre de la motion *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex : Prolongation des horaires de la bibliothèque"
            required
            className="w-full rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm focus:outline-none focus:border-primary/60"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Expliquez le contexte, les bénéfices attendus et les modalités de mise en œuvre…"
            rows={5}
            required
            className="w-full rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm focus:outline-none focus:border-primary/60 resize-none"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">Retour</Button>
          <Button type="submit" disabled={loading} className="flex-1">{loading ? "Création…" : "Déposer la motion"}</Button>
        </div>
      </form>
    </div>
  )
}

export default function NouvelleMotionPage() {
  return (
    <Suspense fallback={<div className="p-8">Chargement…</div>}>
      <NouvelleMotionForm />
    </Suspense>
  )
}
