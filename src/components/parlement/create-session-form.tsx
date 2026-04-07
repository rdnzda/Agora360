"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function CreateSessionForm() {
  const router = useRouter()
  const [monthLabel, setMonthLabel] = useState("")
  const [maxSeats, setMaxSeats] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!monthLabel.trim()) return
    setLoading(true)
    setError("")

    const res = await fetch("/api/parlement/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthLabel, maxSeats }),
    })

    if (!res.ok) {
      setError("Erreur lors de la création.")
      setLoading(false)
      return
    }

    setMonthLabel("")
    router.refresh()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2 items-end">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Libellé du mois</label>
          <input
            value={monthLabel}
            onChange={(e) => setMonthLabel(e.target.value)}
            placeholder="ex : Avril 2026"
            className="w-full rounded-lg border border-border bg-foreground/5 px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
            required
          />
        </div>
        <div className="w-24 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Sièges</label>
          <input
            type="number"
            min={1}
            max={20}
            value={maxSeats}
            onChange={(e) => setMaxSeats(parseInt(e.target.value))}
            className="w-full rounded-lg border border-border bg-foreground/5 px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
          />
        </div>
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? "…" : "Créer"}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  )
}
