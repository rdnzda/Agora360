"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Shuffle, AlertTriangle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
  sessionId: string
  candidateCount: number
  maxSeats: number
}

export function DrawTriggerButton({ sessionId, candidateCount, maxSeats }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const seats = Math.min(candidateCount, maxSeats)

  async function executeDraw() {
    if (!confirmed) { setConfirmed(true); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/parlement/sessions/${sessionId}/tirage`, { method: "POST" })
      if (res.ok) {
        toast.success(`Tirage effectué — ${seats} député${seats > 1 ? "s" : ""} élu${seats > 1 ? "s" : ""} !`)
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data?.error ?? "Erreur lors du tirage au sort.")
      }
    } catch {
      toast.error("Erreur réseau. Veuillez réessayer.")
    } finally {
      setLoading(false)
      setConfirmed(false)
    }
  }

  return (
    <div className="space-y-2.5">
      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 dark:bg-amber-950/30 dark:border-amber-800"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Confirmez le tirage parmi <strong>{candidateCount}</strong> candidat{candidateCount > 1 ? "s" : ""} — cette action est irréversible.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={executeDraw}
        disabled={loading || candidateCount === 0}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.12 }}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
          confirmed
            ? "bg-destructive text-white hover:bg-destructive/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
        {loading
          ? "Tirage en cours…"
          : confirmed
          ? "Confirmer le tirage"
          : `Effectuer le tirage (${seats} élu${seats > 1 ? "s" : ""})`}
      </motion.button>
    </div>
  )
}
