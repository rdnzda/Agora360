"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function LandingNavbar() {
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1])
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        className="absolute inset-0 backdrop-blur-xl border-b border-border"
        style={{
          backgroundColor: `oklch(0.972 0.008 260 / ${bgOpacity.get()})`,
          opacity: bgOpacity,
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-gradient-primary">
            Agora360
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
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
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="btn-primary text-sm font-semibold text-white px-4 py-2 rounded-xl"
          >
            Rejoindre
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
