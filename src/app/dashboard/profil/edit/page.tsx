"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function EditProfilPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch("/api/profil").then((r) => r.json()).then((d) => {
      if (d.user?.name) setName(d.user.name)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError("Le nom ne peut pas être vide."); return }
    setLoading(true)
    setError("")

    const res = await fetch("/api/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })

    if (!res.ok) { setError("Erreur lors de la mise à jour."); setLoading(false); return }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push("/dashboard/profil"), 1000)
  }

  return (
    <div className="p-4 md:p-8 max-w-md">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Modifier mon profil</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="display-name" className="text-sm font-medium text-foreground">Nom affiché</label>
          <input
            id="display-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom"
            required
            className="w-full rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm focus:outline-none focus:border-primary/60"
          />
        </div>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {success && <p role="status" className="text-sm text-emerald-600">Profil mis à jour ! Redirection…</p>}

        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()} className="flex-1">Annuler</Button>
          <Button type="submit" disabled={loading} className="flex-1">{loading ? "…" : "Enregistrer"}</Button>
        </div>
      </form>
    </div>
  )
}
