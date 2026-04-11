"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Loader2, CheckCircle2, CalendarDays, Users } from "lucide-react"

export function CreateSessionForm() {
  const router = useRouter()
  const [monthLabel, setMonthLabel] = useState("")
  const [maxSeats, setMaxSeats] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

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
      setError("Erreur lors de la création de la session.")
      setLoading(false)
      return
    }

    setSuccess(true)
    setMonthLabel("")
    router.refresh()
    setLoading(false)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3 items-end">
        {/* Month label */}
        <div className="flex-1 space-y-1.5">
          <label htmlFor="month-label" className="text-xs font-medium text-muted-foreground">
            Libellé du mois
          </label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="month-label"
              value={monthLabel}
              onChange={(e) => { setMonthLabel(e.target.value); setError("") }}
              placeholder="ex : Avril 2026"
              className="w-full rounded-xl border border-border bg-foreground/5 pl-9 pr-4 py-2.5 text-sm transition-colors focus:outline-none focus:border-primary/60 focus:bg-primary/5"
              required
            />
          </div>
        </div>

        {/* Max seats */}
        <div className="w-28 space-y-1.5">
          <label htmlFor="max-seats" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" /> Sièges
          </label>
          <input
            id="max-seats"
            type="number"
            min={1}
            max={20}
            value={maxSeats}
            onChange={(e) => setMaxSeats(parseInt(e.target.value))}
            className="w-full rounded-xl border border-border bg-foreground/5 px-3 py-2.5 text-sm transition-colors focus:outline-none focus:border-primary/60 focus:bg-primary/5"
          />
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={loading || !monthLabel.trim()}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.12 }}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Création…
            </motion.span>
          ) : success ? (
            <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Session créée
            </motion.span>
          ) : (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Créer la session
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </form>
  )
}
