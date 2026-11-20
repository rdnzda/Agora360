"use client"

import { cn } from "@/lib/utils"
import { CountUp } from "@/components/animations"

type Variant = "primary" | "teal" | "amber" | "violet" | "rose"

type Props = {
  icon: React.ReactNode
  label: string
  value: string | number
  sublabel?: string
  className?: string
  /** Conservé pour compatibilité : l'identité « Registre » n'utilise qu'une couleur. */
  variant?: Variant
}

export function StatCard({ icon, label, value, sublabel, className }: Props) {
  const numericValue = typeof value === "number" ? value : parseInt(value as string, 10)
  const isNumeric = !isNaN(numericValue)

  return (
    <div
      className={cn(
        "h-full bg-card border border-border border-t-2 border-t-foreground rounded-sm p-4 md:p-5 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-foreground leading-tight">{label}</p>
        <span className="shrink-0 text-muted-foreground [&_svg]:w-4 [&_svg]:h-4 [&_svg]:text-current" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div>
        <p className="tabular text-3xl md:text-4xl font-semibold text-foreground leading-none">
          {isNumeric
            ? <CountUp value={numericValue} duration={0.6} />
            : value
          }
        </p>
        {sublabel && (
          <p className="text-xs md:text-sm text-muted-foreground mt-1.5">{sublabel}</p>
        )}
      </div>
    </div>
  )
}
