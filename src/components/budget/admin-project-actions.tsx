"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type ProjectStatus = "PROPOSED" | "ACTIVE" | "FUNDED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED"

const options: { value: ProjectStatus; label: string }[] = [
  { value: "PROPOSED",    label: "Proposé" },
  { value: "ACTIVE",      label: "Vote ouvert" },
  { value: "FUNDED",      label: "Financé" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "COMPLETED",   label: "Terminé" },
  { value: "REJECTED",    label: "Rejeté" },
]

type Props = {
  projectId: string
  currentStatus: ProjectStatus
}

export function AdminProjectActions({ projectId, currentStatus }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function save() {
    if (status === currentStatus) return
    setLoading(true)
    await fetch(`/api/budget/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as ProjectStatus)}
        className="rounded-lg border border-border bg-background text-sm px-3 py-1.5 focus:outline-none focus:border-primary/60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <Button size="sm" onClick={save} disabled={loading || status === currentStatus}>
        {loading ? "…" : "Enregistrer"}
      </Button>
    </div>
  )
}
