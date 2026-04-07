"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const categories = [
  { value: "INFRASTRUCTURE", label: "Infrastructure" },
  { value: "CULTURE",        label: "Culture" },
  { value: "SPORT",          label: "Sport" },
  { value: "NUMERIQUE",      label: "Numérique" },
  { value: "AUTRE",          label: "Autre" },
]

export default function NouveauProjetPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("AUTRE")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!title.trim() || !description.trim() || isNaN(amt) || amt <= 0) {
      setError("Veuillez remplir tous les champs correctement.")
      return
    }

    setLoading(true)
    setError("")

    const res = await fetch("/api/budget/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, amount: amt, category }),
    })

    if (!res.ok) {
      setError("Erreur lors de la création du projet.")
      setLoading(false)
      return
    }

    router.push("/dashboard/budget")
    router.refresh()
  }

  return (
    <div className="p-4 md:p-8 max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Nouveau projet</h1>
        <p className="text-sm text-muted-foreground mt-1">Créez un projet à soumettre au vote des étudiants.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Titre *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nom du projet"
            required
            className="w-full rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm focus:outline-none focus:border-primary/60"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez l'objectif du projet et son impact…"
            rows={4}
            required
            className="w-full rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm focus:outline-none focus:border-primary/60 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Montant (€) *</label>
            <input
              type="number"
              min={1}
              step={0.01}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5000"
              required
              className="w-full rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm focus:outline-none focus:border-primary/60"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary/60"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <motion.p role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive">
            {error}
          </motion.p>
        )}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="ghost" onClick={() => router.back()} className="flex-1">
            Annuler
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Création…" : "Créer le projet"}
          </Button>
        </div>
      </form>
    </div>
  )
}
