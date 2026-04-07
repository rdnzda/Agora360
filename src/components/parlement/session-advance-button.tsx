"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock } from "lucide-react"

type Props = {
  sessionId: string
  currentStatus: "CANDIDATURES" | "ACTIF"
}

const nextStatus = {
  CANDIDATURES: "ACTIF",
  ACTIF: "CLOS",
} as const

const labels = {
  CANDIDATURES: "Passer en session active",
  ACTIF: "Clôturer la session",
}

export function SessionAdvanceButton({ sessionId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  async function handleClick() {
    if (!confirmed) {
      setConfirmed(true)
      return
    }
    setLoading(true)
    await fetch(`/api/parlement/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus[currentStatus] }),
    })
    router.push("/dashboard/parlement")
    router.refresh()
  }

  return (
    <div className="space-y-2">
      {confirmed && (
        <p className="text-xs text-amber-600">
          Cliquez à nouveau pour confirmer — cette action est irréversible.
        </p>
      )}
      <Button
        onClick={handleClick}
        disabled={loading}
        variant={confirmed ? "destructive" : "outline"}
        size="sm"
        className="gap-2"
      >
        {currentStatus === "ACTIF" ? <Lock className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        {loading ? "En cours…" : confirmed ? "Confirmer" : labels[currentStatus]}
      </Button>
    </div>
  )
}
