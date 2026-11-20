import { Ticket } from "lucide-react"

/*
  Aperçu illustratif du GPS Admin : une demande et sa progression.
  Pas de données réelles ; libellés de statut identiques à ceux de l'application.
  Seule animation de la page d'accueil (désactivée si l'utilisateur réduit les animations).
*/
const steps = [
  { label: "Ouvert",   detail: "Demande reçue par le service",   state: "done" },
  { label: "En cours", detail: "Prise en charge par la scolarité", state: "current" },
  { label: "Résolu",   detail: "Vous êtes notifié de la réponse",  state: "todo" },
] as const

export function TicketTrackerPreview() {
  return (
    <figure className="tone-gps">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="tone-tile inline-flex w-11 h-11 items-center justify-center rounded-xl shrink-0">
            <Ticket className="w-5 h-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-muted-foreground">Scolarité</p>
            <p className="text-lg sm:text-xl font-bold text-foreground leading-snug">
              Demande d&apos;attestation de scolarité
            </p>
          </div>
        </div>

        <ol className="mt-8 relative">
          {/* Rail de progression */}
          <span aria-hidden="true" className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-border" />
          <span aria-hidden="true" className="tracker-fill absolute left-[11px] top-3 w-0.5 bg-primary" />
          {steps.map((step, i) => (
            <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0">
              <span
                aria-hidden="true"
                className={
                  "tracker-dot relative z-10 mt-0.5 w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center " +
                  (step.state === "todo"
                    ? "border-input bg-card"
                    : "border-primary bg-primary")
                }
                style={{ animationDelay: `${0.25 + i * 0.45}s` }}
              >
                {step.state === "current" && <span className="w-2 h-2 rounded-full bg-card" />}
              </span>
              <div>
                <p className={step.state === "todo" ? "font-semibold text-muted-foreground" : "font-semibold text-foreground"}>
                  {step.label}
                  {step.state === "current" && <span className="sr-only"> (étape actuelle)</span>}
                </p>
                <p className="text-sm text-muted-foreground">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground">
        Exemple : chaque demande suit ces étapes dans le GPS Admin.
      </figcaption>
    </figure>
  )
}
