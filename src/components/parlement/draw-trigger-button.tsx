"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"

type Props = {
  sessionId: string
  candidateCount: number
  maxSeats: number
}

export function DrawTriggerButton({ sessionId, candidateCount, maxSeats }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  async function executeDraw() {
    if (!confirmed) {
      setConfirmed(true)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/parlement/sessions/${sessionId}/tirage`, { method: "POST" })
      if (res.ok) {
        toast.success(`Tirage effectué — ${Math.min(candidateCount, maxSeats)} député${Math.min(candidateCount, maxSeats) > 1 ? "s" : ""} élu${Math.min(candidateCount, maxSeats) > 1 ? "s" : ""} !`)
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
    <div className="space-y-2">
      {confirmed && (
        <p className="text-xs text-amber-600 font-medium">
          ⚠️ Cliquez à nouveau pour confirmer le tirage parmi {candidateCount} candidat{candidateCount > 1 ? "s" : ""}.
        </p>
      )}
      <Button
        onClick={executeDraw}
        disabled={loading || candidateCount === 0}
        className="gap-2"
        variant={confirmed ? "destructive" : "default"}
      >
        <Shuffle className="w-4 h-4" />
        {loading
          ? "Tirage en cours…"
          : confirmed
          ? "Confirmer le tirage"
          : `Effectuer le tirage (${Math.min(candidateCount, maxSeats)} élu${Math.min(candidateCount, maxSeats) > 1 ? "s" : ""})`
        }
      </Button>
    </div>
  )
}
