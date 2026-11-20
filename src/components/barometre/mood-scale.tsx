"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const emojis = ["😢", "😕", "😐", "🙂", "😄"]
const labels = ["Très mal", "Pas bien", "Neutre", "Bien", "Très bien"]

type Props = {
  label: string
  value: number | null
  onChange: (val: number) => void
}

export function MoodScale({ label, value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {emojis.map((emoji, i) => {
          const score = i + 1
          const isSelected = value === score
          return (
            <motion.button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: isSelected ? 1.12 : 1.05 }}
              className={cn(
                "flex flex-col items-center gap-1.5 w-16 py-3 rounded-2xl border-2 text-3xl transition-colors cursor-pointer relative",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-secondary hover:border-primary/30"
              )}
              aria-label={`${score}/5 — ${labels[i]}`}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <motion.div
                  layoutId="moodIndicator"
                  className="absolute inset-0 rounded-2xl border-2 border-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{emoji}</span>
              <span className={cn(
                "text-[10px] font-medium relative z-10",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}>
                {labels[i]}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
