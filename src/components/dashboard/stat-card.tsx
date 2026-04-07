"use client"

import { cn } from "@/lib/utils"
import { HoverCard, CountUp } from "@/components/animations"

type Variant = "primary" | "teal" | "amber" | "violet" | "rose"

type Props = {
  icon: React.ReactNode
  label: string
  value: string | number
  sublabel?: string
  className?: string
  variant?: Variant
}

const variantStyles: Record<Variant, {
  iconBg: string
  dot: string
}> = {
  primary: {
    iconBg: "bg-primary/8",
    dot: "bg-primary",
  },
  teal: {
    iconBg: "bg-[oklch(0.65_0.16_195/0.08)]",
    dot: "bg-[oklch(0.65_0.16_195)]",
  },
  amber: {
    iconBg: "bg-[oklch(0.70_0.17_47/0.08)]",
    dot: "bg-[oklch(0.70_0.17_47)]",
  },
  violet: {
    iconBg: "bg-[oklch(0.58_0.18_330/0.08)]",
    dot: "bg-[oklch(0.58_0.18_330)]",
  },
  rose: {
    iconBg: "bg-[oklch(0.65_0.18_10/0.08)]",
    dot: "bg-[oklch(0.65_0.18_10)]",
  },
}

export function StatCard({ icon, label, value, sublabel, className, variant = "primary" }: Props) {
  const styles = variantStyles[variant]
  const numericValue = typeof value === "number" ? value : parseInt(value as string, 10)
  const isNumeric = !isNaN(numericValue)

  return (
    <HoverCard>
      <div className={cn(
        "bg-card rounded-xl border border-border p-3 md:p-5 flex items-start gap-3 md:gap-4 card-shadow",
        className
      )}>
        <div className="relative shrink-0">
          <div className={cn(
            "w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center",
            styles.iconBg
          )}>
            {icon}
          </div>
          <span className={cn(
            "absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-card",
            styles.dot
          )} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wide leading-tight">
            {label}
          </p>
          <p className="text-xl md:text-2xl font-bold text-foreground mt-0.5">
            {isNumeric
              ? <CountUp value={numericValue} duration={0.8} />
              : value
            }
          </p>
          {sublabel && (
            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{sublabel}</p>
          )}
        </div>
      </div>
    </HoverCard>
  )
}
