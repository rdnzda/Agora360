type MP = {
  id: string
  user: { name: string | null }
}

export function MpList({ mps }: { mps: MP[] }) {
  if (mps.length === 0) return null

  return (
    <div>
      <p className="text-xs text-muted-foreground font-medium mb-3">Membres élus ce mois-ci</p>
      <div className="flex flex-wrap gap-3">
        {mps.map((mp) => {
          const name = mp.user.name ?? "Anonyme"
          const initial = name.charAt(0).toUpperCase()
          return (
            <div key={mp.id} className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                {initial}
              </div>
              <p className="text-xs text-foreground max-w-[4rem] text-center truncate">{name.split(" ")[0]}</p>
              <p className="text-xs text-amber-600 font-medium">Député·e</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
