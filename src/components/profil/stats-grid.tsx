import { Ticket, BarChart2, ThumbsUp, Landmark, MessageCircleQuestion } from "lucide-react"
import { type LucideIcon } from "lucide-react"

type Stats = {
  ticketCount: number
  barometreCount: number
  voteCount: number
  candidatureCount: number
  faqAnswerCount: number
}

const items: { key: keyof Stats; label: string; icon: LucideIcon }[] = [
  { key: "ticketCount",      label: "Tickets soumis",         icon: Ticket },
  { key: "barometreCount",   label: "Baromètres répondus",    icon: BarChart2 },
  { key: "voteCount",        label: "Votes budget",           icon: ThumbsUp },
  { key: "candidatureCount", label: "Candidatures parlement", icon: Landmark },
  { key: "faqAnswerCount",   label: "Réponses FAQ",           icon: MessageCircleQuestion },
]

export function StatsGrid({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {items.map(({ key, label, icon: Icon }) => (
        <div key={key} className="bg-muted/50 rounded-xl p-4 text-center">
          <Icon className="w-6 h-6 text-primary mx-auto mb-1" />
          <p className="text-xl font-bold text-foreground">{stats[key]}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}
