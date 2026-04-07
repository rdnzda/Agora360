"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoodScale } from "./mood-scale"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

type Props = {
  sessionId: string
}

export function BarometreForm({ sessionId }: Props) {
  const router = useRouter()
  const [moodScore, setMoodScore] = useState<number | null>(null)
  const [wellbeing, setWellbeing] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!moodScore || !wellbeing) {
      setError("Veuillez répondre aux deux questions obligatoires.")
      return
    }

    setLoading(true)
    setError("")

    const res = await fetch(`/api/barometre/sessions/${sessionId}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moodScore, wellbeing, comment: comment || undefined }),
    })

    if (res.status === 409) {
      setError("Vous avez déjà répondu à cette session.")
      setLoading(false)
      return
    }

    if (!res.ok) {
      setError("Une erreur est survenue. Veuillez réessayer.")
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <MoodScale
        label="Comment vous sentez-vous cette semaine ? *"
        value={moodScore}
        onChange={setMoodScore}
      />
      <MoodScale
        label="Comment évaluez-vous votre bien-être sur le campus ? *"
        value={wellbeing}
        onChange={setWellbeing}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Un commentaire ? <span className="text-muted-foreground font-normal">(optionnel)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez ce que vous avez sur le cœur…"
          rows={3}
          className="w-full rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 resize-none"
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Envoi en cours…" : "Soumettre ma réponse"}
      </Button>
    </form>
  )
}
