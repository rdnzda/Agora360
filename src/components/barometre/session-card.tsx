"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CalendarDays, MessageSquare, ChevronRight, CheckCircle2, Lock } from "lucide-react"

type Props = {
  id: string
  weekLabel: string
  status: "OPEN" | "CLOSED"
  responseCount: number
  isAdmin?: boolean
  /** Extra controls rendered in the right section (e.g. admin toggle button) */
  actions?: React.ReactNode
}

export function SessionCard({ id, weekLabel, status, responseCount, isAdmin, actions }: Props) {
  const isOpen = status === "OPEN"

  return (
    <motion.div
      whileHover={{ x: 3 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="group relative flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors duration-150 hover:bg-muted/60"
    >
      {/* Left status stripe */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full transition-opacity duration-150 ${
          isOpen ? "bg-emerald-400 opacity-100" : "bg-border opacity-60"
        }`}
      />

      {/* Status icon */}
      <div
        className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-150 ${
          isOpen
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isOpen
          ? <CheckCircle2 className="w-4 h-4" />
          : <Lock className="w-4 h-4" />
        }
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{weekLabel}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <MessageSquare className="w-3 h-3 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">
            {responseCount} réponse{responseCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Status pill */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            isOpen
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`} />
          {isOpen ? "Ouverte" : "Fermée"}
        </span>

        {/* Admin results link */}
        {isAdmin && (
          <Link
            href={`/dashboard/barometre/resultats/${id}`}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-accent hover:text-accent/80 hover:bg-accent/10 transition-colors duration-150"
          >
            Résultats
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}

        {/* Slot for extra admin actions (e.g. close/reopen toggle) */}
        {actions}
      </div>
    </motion.div>
  )
}
