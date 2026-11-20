import { cn } from "@/lib/utils"

/** Icône Agora360 — image SVG */
export function Agora360Icon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/agora.svg"
      alt="Agora360"
      width={size}
      height={size}
      className={cn("shrink-0 logo-mark", className)}
    />
  )
}

/** Conteneur complet autour du logo */
export function Agora360LogoBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-9 h-9 flex items-center justify-center shrink-0 overflow-hidden",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/agora.svg"
        alt="Agora360"
        width={36}
        height={36}
        className="w-full h-full object-contain logo-mark-on-dark"
      />
    </div>
  )
}

/** Mot-symbole Agora360 — « Agora » en indigo, « 360 » en teal (rappel sobre de l'ancien dégradé). */
export function Agora360Wordmark({
  className,
  onDark = false,
}: { className?: string; onDark?: boolean }) {
  return (
    <span className={cn("font-extrabold tracking-tight", className)}>
      <span className={onDark ? "text-sidebar-foreground" : "text-primary"}>Agora</span>
      <span className={onDark ? "text-sidebar-primary" : "text-accent"}>360</span>
    </span>
  )
}
