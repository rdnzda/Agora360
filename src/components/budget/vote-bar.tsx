"use client"

import { useEffect, useRef } from "react"

type Props = {
  forCount: number
  againstCount: number
}

export function VoteBar({ forCount, againstCount }: Props) {
  const total  = forCount + againstCount
  const forPct = total > 0 ? Math.round((forCount / total) * 100) : 0
  const againstPct = 100 - forPct

  const forRef     = useRef<HTMLDivElement>(null)
  const againstRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const forEl     = forRef.current
    const againstEl = againstRef.current
    if (!forEl || !againstEl) return

    forEl.style.width     = "0%"
    againstEl.style.width = "0%"

    const frame = requestAnimationFrame(() => {
      const t = "width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s"
      forEl.style.transition     = t
      againstEl.style.transition = t
      forEl.style.width     = total > 0 ? `${forPct}%` : "50%"
      againstEl.style.width = total > 0 ? `${againstPct}%` : "50%"
    })
    return () => cancelAnimationFrame(frame)
  }, [forPct, againstPct, total])

  return (
    <div className="space-y-2">
      {/* Bar */}
      <div className="flex h-3 rounded-full overflow-hidden bg-muted gap-0.5">
        {total > 0 ? (
          <>
            <div
              ref={forRef}
              className="h-full rounded-l-full"
              style={{
                background: "linear-gradient(90deg, oklch(0.55 0.16 160), oklch(0.72 0.19 195))",
                width: "0%",
              }}
            />
            <div
              ref={againstRef}
              className="h-full rounded-r-full flex-1"
              style={{
                background: "linear-gradient(90deg, oklch(0.65 0.22 25), oklch(0.60 0.20 10))",
                width: "0%",
              }}
            />
          </>
        ) : (
          <div className="flex-1 bg-muted rounded-full" />
        )}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs font-medium">
        <span className="text-emerald-600 dark:text-emerald-400">
          ✓ {forCount} pour{total > 0 && <span className="text-muted-foreground font-normal ml-1">({forPct}%)</span>}
        </span>
        <span className="text-red-500 dark:text-red-400">
          {againstCount} contre ✗{total > 0 && <span className="text-muted-foreground font-normal ml-1">({againstPct}%)</span>}
        </span>
      </div>
    </div>
  )
}
