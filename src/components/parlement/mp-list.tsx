import { Crown } from "lucide-react"

type MP = {
  id: string
  user: { name: string | null }
}

export function MpList({ mps }: { mps: MP[] }) {
  if (mps.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-3.5 h-3.5 text-amber-500" />
        <p className="text-xs font-semibold text-foreground">
          {mps.length} membre{mps.length > 1 ? "s" : ""} élu{mps.length > 1 ? "s" : ""} ce mois-ci
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        {mps.map((mp) => {
          const name = mp.user.name ?? "Anonyme"
          const initial = name.charAt(0).toUpperCase()
          return (
            <div key={mp.id} className="flex flex-col items-center gap-1.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 ring-2 ring-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {initial}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                  <Crown className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <p className="text-xs font-medium text-foreground max-w-[4rem] text-center truncate">
                {name.split(" ")[0]}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
