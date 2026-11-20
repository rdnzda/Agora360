"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "./sidebar"
import { Agora360Wordmark } from "@/components/logo"

type Props = {
  userName: string
  userRole: string
  userImage?: string | null
  children: React.ReactNode
}

export function DashboardShell({ userName, userRole, userImage, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Aller au contenu principal
      </a>

      {/* Desktop sidebar — full with labels */}
      <div className="hidden md:flex">
        <Sidebar userName={userName} userRole={userRole} userImage={userImage} variant="full" />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-foreground/40"
              onClick={() => setOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute left-0 top-0 h-full z-50 flex"
            >
              <Sidebar userName={userName} userRole={userRole} userImage={userImage} variant="full" onNavigate={() => setOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="flex md:hidden items-center gap-3 px-4 h-14 border-b border-sidebar-border bg-sidebar shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="p-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5 text-sidebar-foreground" />
          </button>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/agora.svg" alt="" width={26} height={26} className="shrink-0 logo-mark-on-dark" />
            <Agora360Wordmark onDark className="text-base" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setOpen(false)}
              className={cn("p-1.5 rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent transition-colors cursor-pointer", open ? "" : "invisible")}
              aria-label="Fermer le menu"
              aria-hidden={!open}
              tabIndex={open ? undefined : -1}
            >
              <X className="w-5 h-5 text-sidebar-foreground" />
            </button>
          </div>
        </header>

        <main id="main-content" className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
