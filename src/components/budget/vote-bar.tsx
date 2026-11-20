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
      <div className="flex h-2.5 rounded-full overflow-hidden bg-muted gap-0.5">
        {total > 0 ? (
          <>
            <div
              ref={forRef}
              className="h-full bg-vote-for"
              style={{ width: "0%" }}
            />
            <div
              ref={againstRef}
              className="h-full flex-1 bg-vote-against"
              style={{ width: "0%" }}
            />
          </>
        ) : (
          <div className="flex-1 bg-muted" />
        )}
      </div>

      {/* Labels */}
      <div className="tabular flex justify-between text-sm font-semibold">
        <span className="text-vote-for">
          {forCount} pour{total > 0 && <span className="text-muted-foreground font-normal ml-1">({forPct}%)</span>}
        </span>
        <span className="text-vote-against">
          {againstCount} contre{total > 0 && <span className="text-muted-foreground font-normal ml-1">({againstPct}%)</span>}
        </span>
      </div>
    </div>
  )
}
