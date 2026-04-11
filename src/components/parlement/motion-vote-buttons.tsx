"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ThumbsUp, ThumbsDown, Minus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type VoteType = "FOR" | "AGAINST" | "ABSTAIN"

type Props = {
  motionId: string
  myVote: VoteType | null
}

const options: { value: VoteType; label: string; Icon: React.ElementType; active: string; inactive: string }[] = [
  {
    value: "FOR",
    label: "Pour",
    Icon: ThumbsUp,
    active: "bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-600 dark:text-emerald-400",
    inactive: "hover:border-emerald-300 hover:text-emerald-600",
  },
  {
    value: "AGAINST",
    label: "Contre",
    Icon: ThumbsDown,
    active: "bg-red-50 border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-600 dark:text-red-400",
    inactive: "hover:border-red-300 hover:text-red-600",
  },
  {
    value: "ABSTAIN",
    label: "Abstention",
    Icon: Minus,
    active: "bg-muted border-muted-foreground/40 text-muted-foreground",
    inactive: "hover:border-muted-foreground/40 hover:text-muted-foreground",
  },
]

export function MotionVoteButtons({ motionId, myVote }: Props) {
  const router = useRouter()
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
      {options.map(({ value, label, Icon, active, inactive }) => (
        <button
          key={value}
          onClick={() => vote(value)}
          disabled={loading}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 disabled:opacity-50 cursor-pointer",
            current === value ? active : `border-border text-muted-foreground ${inactive}`
          )}
        >
          {loading && current !== value ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Icon className="w-3.5 h-3.5" />
          )}
          {label}
        </button>
      ))}
    </div>
  )
}
