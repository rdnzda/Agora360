"use client"

import { useEffect, useRef } from "react"
import { getLevel } from "@/lib/gamification"
import { Trophy } from "lucide-react"
import { CountUp } from "@/components/animations"

export function LevelIndicator({ points }: { points: number }) {
  const level = getLevel(points)
  const pct = level.next ? Math.min((level.current / level.next) * 100, 100) : 100
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    // Animate bar width from 0 to pct
    bar.style.width = "0%"
    const frame = requestAnimationFrame(() => {
      bar.style.transition = "width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      bar.style.width = `${pct}%`
    })
    return () => cancelAnimationFrame(frame)
  }, [pct])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent-warm" />
          <span className="text-sm font-bold text-gradient-warm">{level.label}</span>
        </div>
        <span className="text-sm font-extrabold text-foreground">
          <CountUp value={points} suffix=" pts" duration={1.0} />
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full relative"
          style={{
            background: "var(--primary)",
            width: "0%",
          }}
        >
          {/* Glowing cap */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-warm ring-2 ring-card" />
        </div>
      </div>

      {level.nextLabel && (
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{level.next! - level.current}</span> pts pour atteindre{" "}
          <span className="font-medium text-accent">{level.nextLabel}</span>
        </p>
      )}
      {!level.nextLabel && (
        <p className="text-xs text-accent font-semibold">Niveau maximum atteint.</p>
      )}
    </div>
  )
}
