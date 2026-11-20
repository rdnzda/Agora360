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
  ShoppingBag,
  MessageCircleQuestion,
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Tooltip } from "@base-ui/react/tooltip"
import { Agora360LogoBadge, Agora360Wordmark } from "@/components/logo"

const navItems = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    tone: "tone-neutral",
    icon: LayoutDashboard,
    active: true,
    exact: true,
  },
  {
    label: "GPS Admin",
    href: "/dashboard/tickets",
    tone: "tone-gps",
    icon: Ticket,
    active: true,
    exact: false,
  },
  {
    label: "Parlement Éphémère",
    href: "/dashboard/parlement",
    tone: "tone-parlement",
    icon: Landmark,
    active: true,
    exact: false,
  },
  {
    label: "Baromètre",
    href: "/dashboard/barometre",
    tone: "tone-barometre",
    icon: BarChart2,
    active: true,
    exact: false,
  },
  {
    label: "Budget Participatif",
    href: "/dashboard/budget",
    tone: "tone-budget",
    icon: Wallet,
    active: true,
    exact: false,
  },
  {
    label: "FAQ",
    href: "/dashboard/faq",
    tone: "tone-faq",
    icon: MessageCircleQuestion,
    active: true,
    exact: false,
  },
  {
    label: "Boutique",
    href: "/dashboard/boutique",
    tone: "tone-boutique",
    icon: ShoppingBag,
    active: true,
    exact: false,
  },
  {
    label: "Mon Profil",
    href: "/dashboard/profil",
    tone: "tone-profil",
    icon: UserCircle,
    active: true,
    exact: false,
  },
  {
    label: "Paramètres",
    href: "/dashboard/settings",
    tone: "tone-neutral",
    icon: Settings,
    active: true,
    exact: false,
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
          <Tooltip.Popup className="z-50 px-2.5 py-1.5 rounded-sm text-xs font-medium bg-foreground text-background whitespace-nowrap">
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
      <aside className="on-dark w-14 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col items-center">
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
                    "relative flex items-center justify-center w-10 h-10 rounded-md transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-sidebar-primary"
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
          <NavTooltip label={`${userName} (${userRole === "ADMIN" ? "Admin" : "Étudiant"})`}>
            <Link
              href="/dashboard/profil"
              onClick={onNavigate}
              className="w-9 h-9 rounded-full overflow-hidden hover:ring-2 hover:ring-sidebar-primary/40 transition-all shrink-0"
            >
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userImage} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
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
                className="w-9 h-9 rounded-md flex items-center justify-center text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors cursor-pointer"
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
              className="w-9 h-9 rounded-md flex items-center justify-center text-sidebar-foreground/65 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
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
    <aside className="on-dark w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <Agora360LogoBadge className="w-8 h-8" />
          <Agora360Wordmark onDark className="text-xl" />
        </div>
        <div className="text-xs text-sidebar-foreground/65 mt-2 flex items-center gap-1.5">
          Gouvernance participative
          <span className="ml-auto tabular text-[11px] text-sidebar-foreground/55">
            v0.1
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Navigation principale" className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = item.active && (
            item.exact ? pathname === item.href : pathname.startsWith(item.href)
          )
          const isDisabled = !item.active
          const Icon = item.icon

          if (isDisabled) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/40 cursor-not-allowed text-sm"
                title="Bientôt disponible"
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
                <span className="ml-auto text-xs border border-sidebar-border text-sidebar-foreground/55 px-1.5 py-0.5 rounded-sm">
                  Bientôt
                </span>
              </div>
            )
          }

          return (
            <div key={item.label}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-full before:bg-sidebar-primary"
                    : "font-medium text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )}
              >
                <Icon className={cn(
                  "w-[18px] h-[18px] shrink-0 tone-text",
                  item.tone,
                  !isActive && "opacity-80"
                )} />
                <span>{item.label}</span>
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userImage} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{userName}</p>
            <p className="text-xs text-sidebar-foreground/65">
              {userRole === "ADMIN" ? "Administration" : "Étudiant"}
            </p>
          </div>
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-md text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer shrink-0"
              aria-label="Basculer le thème"
            >
              {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full text-left text-sm text-sidebar-foreground/70 hover:text-destructive transition-colors px-1 py-1 rounded-md cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}
