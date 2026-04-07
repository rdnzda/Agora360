"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type VoteType = "FOR" | "AGAINST" | "ABSTAIN"

type Props = {
  motionId: string
  myVote: VoteType | null
}

export function MotionVoteButtons({ motionId, myVote }: Props) {
  const router  = useRouter()
  const [current, setCurrent] = useState(myVote)
  const [loading, setLoading] = useState(false)

  async function vote(choice: VoteType) {
    setLoading(true)
    try {
      const res = await fetch(`/api/parlement/motions/${motionId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: choice }),
      })
      if (res.ok) {
        setCurrent(choice)
        router.refresh()
        const labels: Record<VoteType, string> = {
          FOR: "Vote « Pour » enregistré !",
          AGAINST: "Vote « Contre » enregistré !",
          ABSTAIN: "Abstention enregistrée.",
        }
        toast.success(labels[choice])
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data?.error ?? "Impossible d'enregistrer votre vote.")
      }
    } catch {
      toast.error("Erreur réseau. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        size="sm" variant="outline" disabled={loading} onClick={() => vote("FOR")}
        className={cn("gap-1 transition-all", current === "FOR" && "bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-600 dark:text-emerald-400")}
      >
        ✓ Pour
      </Button>
      <Button
        size="sm" variant="outline" disabled={loading} onClick={() => vote("AGAINST")}
        className={cn("gap-1 transition-all", current === "AGAINST" && "bg-red-50 border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-600 dark:text-red-400")}
      >
        ✗ Contre
      </Button>
      <Button
        size="sm" variant="outline" disabled={loading} onClick={() => vote("ABSTAIN")}
        className={cn("gap-1 transition-all", current === "ABSTAIN" && "bg-muted border-muted-foreground/40 text-muted-foreground")}
      >
        — Abstention
      </Button>
    </div>
  )
}
