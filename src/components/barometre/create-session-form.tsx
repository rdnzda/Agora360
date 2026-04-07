"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function CreateSessionForm() {
  const router = useRouter()
  const [weekLabel, setWeekLabel] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!weekLabel.trim()) return
    setLoading(true)
    setError("")

    const res = await fetch("/api/barometre/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weekLabel }),
    })

    if (!res.ok) {
      setError("Erreur lors de la création de la session.")
      setLoading(false)
      return
    }

    setWeekLabel("")
    router.refresh()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1 space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Libellé de la semaine</label>
        <input
          value={weekLabel}
          onChange={(e) => setWeekLabel(e.target.value)}
          placeholder="ex : Semaine du 31 mars 2026"
          className="w-full rounded-lg border border-border bg-foreground/5 px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
          required
        />
      </div>
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-destructive">
          {error}
        </motion.p>
      )}
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? "…" : "Créer"}
      </Button>
    </form>
  )
}
