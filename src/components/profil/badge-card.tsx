"use client"

import { cn } from "@/lib/utils"
import { Lock } from "lucide-react"
import { motion } from "framer-motion"

type Props = {
  name: string
  description: string
  icon: React.ReactNode
  earned: boolean
  earnedAt?: string | null
  delay?: number
}

export function BadgeCard({ name, description, icon, earned, earnedAt, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className={cn(
        "rounded-2xl border p-4 text-center space-y-3 transition-all",
        earned
          ? "bg-mesh-card border-primary/25 shadow-sm card-hover"
          : "bg-muted/20 border-border saturate-0 opacity-40"
      )}
    >
      <div className="flex justify-center">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center",
          earned
            ? "bg-gradient-to-br from-primary/20 to-accent/10"
            : "bg-muted"
        )}>
          {icon}
        </div>
      </div>
      <div>
        <p className={cn(
          "text-sm font-bold",
          earned ? "text-foreground" : "text-muted-foreground"
        )}>{name}</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>
      {earned && earnedAt && (
        <p className="text-xs text-accent font-medium">
          Obtenu le {new Date(earnedAt).toLocaleDateString("fr-FR")}
        </p>
      )}
      {!earned && (
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Non débloqué
        </p>
      )}
    </motion.div>
  )
}
