import { Ticket, Wallet, Landmark, BarChart2 } from "lucide-react"

const modules = [
  { icon: Ticket,    label: "GPS Admin",           text: "Suivi de vos demandes administratives, étape par étape." },
  { icon: Wallet,    label: "Budget participatif", text: "Vote des projets financés sur le budget du campus." },
  { icon: Landmark,  label: "Parlement éphémère",  text: "Tirage au sort mensuel des députés étudiants." },
  { icon: BarChart2, label: "Baromètre campus",    text: "Sondage hebdomadaire anonyme sur le bien-être." },
]

/** Panneau latéral des pages de connexion / inscription — contenu factuel, sans image ni témoignage. */
export function AuthAside() {
  return (
    <aside className="hidden md:flex flex-1 panel-civic">
      <div className="flex flex-col justify-between w-full max-w-xl mx-auto px-10 lg:px-14 py-14">
        <p className="flex items-center gap-3 text-sm font-semibold opacity-85">
          <span aria-hidden="true" className="inline-block w-8 h-0.5 bg-current" />
          Gouvernance participative universitaire
        </p>

        <div>
          <h2 className="text-4xl lg:text-5xl font-semibold leading-[1.05] tracking-tight">
            Suivez vos dossiers, votez, co-décidez.
          </h2>
          <ul className="mt-10 border-t border-current/25">
            {modules.map((m) => (
              <li key={m.label} className="flex gap-4 py-4 border-b border-current/25">
                <m.icon className="w-5 h-5 mt-0.5 shrink-0 opacity-85" aria-hidden="true" />
                <div>
                  <p className="font-semibold">{m.label}</p>
                  <p className="text-sm opacity-80 leading-relaxed">{m.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm opacity-70">© 2025 Agora360</p>
      </div>
    </aside>
  )
}
