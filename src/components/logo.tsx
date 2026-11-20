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
      className={cn("shrink-0", className)}
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
        className="w-full h-full object-contain"
      />
    </div>
  )
}
