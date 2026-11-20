"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"
import { Agora360Wordmark } from "@/components/logo"

export function LandingNavbar() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border px-4 sm:px-6">
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 rounded-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/agora.svg" alt="" width={30} height={30} className="shrink-0 logo-mark" />
          <Agora360Wordmark className="text-lg" />
        </Link>

        {/* Actions */}
        <nav aria-label="Compte" className="flex items-center gap-1 sm:gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Basculer le thème"
            >
              {resolvedTheme === "dark"
                ? <Sun className="w-4 h-4" />
                : <Moon className="w-4 h-4" />
              }
            </button>
          )}
          <Link
            href="/login"
            className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-foreground hover:underline underline-offset-4"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="btn-primary text-sm font-semibold px-4 py-2 rounded-md"
          >
            Créer un compte
          </Link>
        </nav>
      </div>
    </header>
  )
}
