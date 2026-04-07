"use client"

import { Mail, Settings2, CheckCircle2, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { statusConfig } from "./ticket-status-badge"

type HistoryEntry = {
  id: string
  status: keyof typeof statusConfig
  comment: string | null
  createdAt: string
  changedBy: { name: string }
}

const statusIcon = {
  OPEN: Mail,
  IN_PROGRESS: Settings2,
  RESOLVED: CheckCircle2,
  CLOSED: Lock,
}

const ease = [0.25, 0.46, 0.45, 0.94] as const

export function TicketTimeline({ history }: { history: HistoryEntry[] }) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-6">
        {history.map((entry, index) => {
          const config = statusConfig[entry.status]
          const isLast = index === history.length - 1
          const Icon = statusIcon[entry.status] ?? Mail
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08, ease }}
              className="relative flex gap-4"
            >
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                  isLast
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-semibold ${config.className.split(" ").find(c => c.startsWith("text-"))}`}>
                    {config.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    par {entry.changedBy.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(entry.createdAt).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {entry.comment && (
                  <p className="mt-1 text-sm text-foreground/80 bg-muted rounded-md px-3 py-2">
                    {entry.comment}
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
