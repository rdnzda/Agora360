"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type Props = {
  sessionId: string
  currentStatus: "OPEN" | "CLOSED"
}

export function AdminSessionActions({ sessionId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    await fetch(`/api/barometre/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: currentStatus === "OPEN" ? "CLOSED" : "OPEN" }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <Button
      size="sm"
      variant={currentStatus === "OPEN" ? "destructive" : "outline"}
      onClick={toggle}
      disabled={loading}
    >
      {loading ? "…" : currentStatus === "OPEN" ? "Fermer la session" : "Rouvrir"}
    </Button>
  )
}
