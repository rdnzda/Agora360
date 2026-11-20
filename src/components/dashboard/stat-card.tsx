"use client"

import { cn } from "@/lib/utils"

type Variant = "primary" | "teal" | "amber" | "violet" | "rose"

type Props = {
  icon: React.ReactNode
  label: string
  value: string | number
  sublabel?: string
  className?: string
  variant?: Variant
}

/** Couleur de module, appliquée seulement à la pastille d'icône. */
const toneByVariant: Record<Variant, string> = {
  primary: "tone-gps",
  teal:    "tone-budget",
  amber:   "tone-barometre",
  violet:  "tone-parlement",
  rose:    "tone-profil",
}

export function StatCard({ icon, label, value, sublabel, className, variant = "primary" }: Props) {
  const numericValue = typeof value === "number" ? value : parseInt(value as string, 10)
  const isNumeric = !isNaN(numericValue)

  return (
    <div
      className={cn(
        "h-full bg-card border border-border rounded-xl p-4 md:p-5 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-muted-foreground leading-tight pt-1">{label}</p>
        <span className={cn("tone-tile shrink-0 inline-flex w-8 h-8 items-center justify-center rounded-lg [&_svg]:w-4 [&_svg]:h-4 [&_svg]:text-current", toneByVariant[variant])} aria-hidden="true">
          {icon}
        </span>
      </div>
      <div>
        <p className="tabular text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-none">
          {isNumeric ? numericValue : value}
        </p>
        {sublabel && (
          <p className="text-xs md:text-sm text-muted-foreground mt-1.5">{sublabel}</p>
        )}
      </div>
    </div>
  )
}
