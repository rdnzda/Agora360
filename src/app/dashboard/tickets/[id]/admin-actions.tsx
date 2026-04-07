"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const statusOptions = [
  { value: "OPEN", label: "Ouvert" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "RESOLVED", label: "Résolu" },
  { value: "CLOSED", label: "Fermé" },
]

type Props = {
  ticketId: string
  currentStatus: string
  currentAssignedToId: string | null
  adminId: string
  adminName: string
}

export function AdminTicketActions({ ticketId, currentStatus, currentAssignedToId, adminId }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const isAssignedToMe = currentAssignedToId === adminId

  async function handleUpdate() {
    setLoading(true)
    await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, comment: comment || undefined }),
    })
    setComment("")
    setLoading(false)
    router.refresh()
  }

  async function handleAssign() {
    setLoading(true)
    await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedToId: isAssignedToMe ? null : adminId }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant={isAssignedToMe ? "outline" : "secondary"}
          size="sm"
          onClick={handleAssign}
          disabled={loading}
        >
          {isAssignedToMe ? "Se désassigner" : "M'assigner ce ticket"}
        </Button>
        {currentAssignedToId && !isAssignedToMe && (
          <span className="text-xs text-gray-400">Assigné à quelqu&apos;un d&apos;autre</span>
        )}
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <Label>Changer le statut</Label>
          <Select value={status} onValueChange={(v) => { if (v) setStatus(v) }}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="comment">Commentaire (optionnel)</Label>
          <Textarea
            id="comment"
            placeholder="Ajoutez un message visible par l'étudiant..."
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <Button
          onClick={handleUpdate}
          disabled={loading || status === currentStatus}
        >
          {loading ? "Mise à jour..." : "Mettre à jour le ticket"}
        </Button>
      </div>
    </div>
  )
}
