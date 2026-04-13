"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Ticket,
  Landmark,
  BarChart2,
  Wallet,
  UserCircle,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Tooltip } from "@base-ui/react/tooltip"
import { Agora360Icon, Agora360LogoBadge } from "@/components/logo"

const navItems = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    active: true,
    exact: true,
    iconColor: "text-sidebar-primary",
  },
  {
    label: "GPS Admin",
    href: "/dashboard/tickets",
    icon: Ticket,
    active: true,
    exact: false,
    iconColor: "text-[oklch(0.70_0.22_278)]",
  },
  {
    label: "Parlement Éphémère",
    href: "/dashboard/parlement",
    icon: Landmark,
    active: true,
    exact: false,
    iconColor: "text-[oklch(0.72_0.19_330)]",
  },
  {
    label: "Baromètre",
    href: "/dashboard/barometre",
    icon: BarChart2,
    active: true,
    exact: false,
    iconColor: "text-[oklch(0.72_0.19_47)]",
  },
  {
    label: "Budget Participatif",
    href: "/dashboard/budget",
    icon: Wallet,
    active: true,
    exact: false,
    iconColor: "text-[oklch(0.72_0.19_195)]",
  },
  {
    label: "Mon Profil",
    href: "/dashboard/profil",
    icon: UserCircle,
    active: true,
    exact: false,
    iconColor: "text-[oklch(0.68_0.20_10)]",
  },
  {
    label: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
    active: true,
    exact: false,
    iconColor: "text-[oklch(0.65_0.05_240)]",
  },
]

/* ── Tooltip helper pour la sidebar slim ─────────────────────────────── */
function NavTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger delay={300} render={<span className="flex items-center justify-center" />}>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner side="right" sideOffset={10}>
          <Tooltip.Popup className="z-50 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-sidebar text-sidebar-foreground border border-sidebar-border shadow-lg whitespace-nowrap">
            {label}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

type SidebarVariant = "slim" | "full"

export function Sidebar({
  userName,
  userRole,
  userImage,
  onNavigate,
  variant = "slim",
}: {
  userName: string
  userRole: string
  userImage?: string | null
  onNavigate?: () => void
  variant?: SidebarVariant
}) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  /* ── Slim sidebar (desktop) ────────────────────────────────────────── */
  if (variant === "slim") {
    return (
      <aside className="w-14 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col items-center">
        {/* Brand — logo icône */}
        <div className="py-5 w-full border-b border-sidebar-border flex justify-center">
          <NavTooltip label="Agora360">
            <Agora360LogoBadge />
          </NavTooltip>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center py-3 gap-1 w-full px-2">
          {navItems.map((item, index) => {
            const isActive = item.active && (
              item.exact ? pathname === item.href : pathname.startsWith(item.href)
            )
            const isDisabled = !item.active
            const Icon = item.icon

            if (isDisabled) {
              return (
                <NavTooltip key={item.label} label={`${item.label} — Bientôt`}>
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl text-sidebar-foreground/30 cursor-not-allowed">
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>
                </NavTooltip>
              )
            }

            return (
              <NavTooltip key={item.label} label={item.label}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-white/10 text-sidebar-primary"
                      : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-sidebar-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </NavTooltip>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="py-4 w-full border-t border-sidebar-border flex flex-col items-center gap-2">
          {/* Avatar → lien profil */}
          <NavTooltip label={`${userName} · ${userRole === "ADMIN" ? "Admin" : "Étudiant"}`}>
            <Link
              href="/dashboard/profil"
              onClick={onNavigate}
              className="w-9 h-9 rounded-xl overflow-hidden hover:ring-2 hover:ring-sidebar-primary/40 transition-all shrink-0"
            >
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userImage} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full bg-gradient-to-br from-primary to-sidebar-primary flex items-center justify-center text-white font-bold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </Link>
          </NavTooltip>

          {/* Thème */}
          {mounted && (
            <NavTooltip label={resolvedTheme === "dark" ? "Mode clair" : "Mode sombre"}>
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors cursor-pointer"
                aria-label="Basculer le thème"
              >
                {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </NavTooltip>
          )}

          {/* Déconnexion */}
          <NavTooltip label="Se déconnecter">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sidebar-foreground/40 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
              aria-label="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </NavTooltip>
        </div>
      </aside>
    )
  }

  /* ── Full sidebar (mobile drawer) ─────────────────────────────────── */
  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-1">
          <Agora360LogoBadge />
          <div className="text-xl font-extrabold tracking-tight text-gradient-primary">
            Agora360
          </div>
        </div>
        <div className="text-xs text-sidebar-foreground/40 mt-1.5 ml-0.5 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
          Gouvernance participative
          <span className="ml-auto px-1.5 py-0.5 rounded-md bg-white/8 text-sidebar-foreground/40 text-[10px] font-medium">
            v0.1
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item, index) => {
          const isActive = item.active && (
            item.exact ? pathname === item.href : pathname.startsWith(item.href)
          )
          const isDisabled = !item.active
          const Icon = item.icon

          if (isDisabled) {
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 + 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground/30 cursor-not-allowed text-sm"
                title="Bientôt disponible"
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
                <span className="ml-auto text-xs bg-white/5 text-sidebar-foreground/30 px-1.5 py-0.5 rounded-md">
                  Bientôt
                </span>
              </motion.div>
            )
          }

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 + 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-sidebar-primary shadow-sm"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive ? "text-sidebar-primary" : item.iconColor + " opacity-70"
                )} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicatorFull"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userImage} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full bg-gradient-to-br from-primary to-sidebar-primary flex items-center justify-center text-white font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{userName}</p>
            <p className="text-xs text-sidebar-foreground/50">
              {userRole === "ADMIN" ? "Administration" : "Étudiant"}
            </p>
          </div>
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer shrink-0"
              aria-label="Basculer le thème"
            >
              {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full text-left text-sm text-sidebar-foreground/40 hover:text-red-400 transition-colors px-1 cursor-pointer group"
        >
          <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}
