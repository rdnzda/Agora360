"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LockOpen, Lock, Loader2 } from "lucide-react"
import { toast } from "sonner"

type Props = {
  sessionId: string
  currentStatus: "OPEN" | "CLOSED"
}

export function AdminSessionActions({ sessionId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isOpen = currentStatus === "OPEN"

  async function toggle() {
    setLoading(true)
    const res = await fetch(`/api/barometre/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: isOpen ? "CLOSED" : "OPEN" }),
    })
    if (!res.ok) toast.error("Erreur lors de la mise à jour de la session.")
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 disabled:opacity-50 cursor-pointer ${
        isOpen
          ? "text-destructive hover:bg-destructive/10"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isOpen ? (
        <Lock className="w-3.5 h-3.5" />
      ) : (
        <LockOpen className="w-3.5 h-3.5" />
      )}
      {loading ? "…" : isOpen ? "Fermer" : "Rouvrir"}
    </button>
  )
}
