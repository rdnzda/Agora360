"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  projectId: string
  myVote: "FOR" | "AGAINST" | null
}

export function VoteButtons({ projectId, myVote }: Props) {
  const router = useRouter()
  const [current, setCurrent] = useState(myVote)
  const [loading, setLoading] = useState(false)

  async function vote(choice: "FOR" | "AGAINST") {
    setLoading(true)
    try {
      const res = await fetch(`/api/budget/projects/${projectId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: choice }),
      })
      if (res.ok) {
        setCurrent(choice)
        router.refresh()
        toast.success(choice === "FOR" ? "Vote « Pour » enregistré !" : "Vote « Contre » enregistré !")
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
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={() => vote("FOR")}
        className={cn(
          "gap-1.5 transition-all",
          current === "FOR" && "bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-600 dark:text-emerald-400"
        )}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        Pour
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={() => vote("AGAINST")}
        className={cn(
          "gap-1.5 transition-all",
          current === "AGAINST" && "bg-red-50 border-red-400 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-600 dark:text-red-400"
        )}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
        Contre
      </Button>
    </div>
  )
}
