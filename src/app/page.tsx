import Link from "next/link"
import {
  Ticket, BarChart2, Wallet, Landmark, UserCircle, LayoutDashboard,
} from "lucide-react"
import { LandingNavbar } from "@/components/landing-navbar"
import { TicketTrackerPreview } from "@/components/landing/ticket-tracker-preview"
import { Agora360Wordmark } from "@/components/logo"

// ── Modules ───────────────────────────────────────────────────────────────────
const features = [
  {
    id: "gps",
    tone: "tone-gps",
    icon: Ticket,
    label: "GPS Admin",
    title: "Suivez vos dossiers en temps réel",
    description:
      "Comme un colis, suivez l'avancement de vos demandes administratives étape par étape. Scolarité, logement, informatique — plus d'incertitude.",
    href: "/dashboard/tickets",
    cta: "Soumettre un ticket",
  },
  {
    id: "budget",
    tone: "tone-budget",
    icon: Wallet,
    label: "Budget participatif",
    title: "Votez pour les projets campus",
    description: "Allouez le budget annuel aux projets qui comptent vraiment pour vous.",
    href: "/dashboard/budget",
    cta: "Voir les projets",
  },
  {
    id: "parlement",
    tone: "tone-parlement",
    icon: Landmark,
    label: "Parlement éphémère",
    title: "Co-décidez avec l'administration",
    description: "Tirage au sort mensuel pour siéger comme député étudiant et co-créer les décisions campus.",
    href: "/dashboard/parlement",
    cta: "Voir les sessions",
  },
  {
    id: "barometre",
    tone: "tone-barometre",
    icon: BarChart2,
    label: "Baromètre campus",
    title: "Exprimez votre vécu chaque semaine",
    description: "Sondage hebdomadaire anonyme sur le climat et le bien-être de votre campus.",
    href: "/dashboard/barometre",
    cta: "Répondre au baromètre",
  },
  {
    id: "profil",
    tone: "tone-profil",
    icon: UserCircle,
    label: "Profil et engagement",
    title: "Chaque action compte",
    description: "Points, badges et une Carte d'Impact certifiable sur LinkedIn pour valoriser votre engagement.",
    href: "/dashboard/profil",
    cta: "Voir mon profil",
  },
  {
    id: "dashboard",
    tone: "tone-neutral",
    icon: LayoutDashboard,
    label: "Tableau de bord",
    title: "Votre campus, en un coup d'œil",
    description:
      "Vue consolidée de tous vos tickets, votes et participations. Statistiques en temps réel pour les administrateurs.",
    href: "/dashboard",
    cta: "Ouvrir le tableau de bord",
  },
]

// ── Étapes ────────────────────────────────────────────────────────────────────
const steps = [
  {
    number: "1",
    title: "Créez votre compte",
    description: "Inscrivez-vous avec votre email universitaire et accédez instantanément à toutes les fonctionnalités.",
  },
  {
    number: "2",
    title: "Participez activement",
    description: "Soumettez des tickets, votez sur les budgets, candidatez au Parlement, répondez au Baromètre.",
  },
  {
    number: "3",
    title: "Suivez votre impact",
    description: "Gagnez des points, débloquez des badges et mesurez votre contribution au campus.",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingNavbar />

      <main>
        {/* ── HERO : le geste le plus caractéristique — suivre une demande ── */}
        <section className="border-b border-border px-4 sm:px-6">
          <div className="max-w-6xl mx-auto py-14 md:py-24 grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <h1 className="text-[2.6rem] leading-[1.03] sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
                La voix de votre campus
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-[34rem] leading-relaxed">
                Agora360 réunit étudiants et administration dans une gouvernance transparente et participative.
                Suivez vos dossiers, votez, co-décidez au même endroit.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5">
                <Link
                  href="/dashboard"
                  className="btn-primary inline-flex items-center justify-center font-semibold px-6 py-3.5 rounded-lg text-base"
                >
                  Accéder au tableau de bord
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-1 py-3 text-base font-semibold text-primary underline decoration-primary/30 decoration-2 underline-offset-[6px] hover:decoration-primary"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6">
              <TicketTrackerPreview />
            </div>
          </div>
        </section>

        {/* ── MODULES ───────────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 px-4 sm:px-6" aria-labelledby="modules-title">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-4 lg:grid-cols-12 lg:gap-16 mb-10 md:mb-12">
              <h2 id="modules-title" className="lg:col-span-6 text-3xl md:text-4xl font-extrabold tracking-tight">
                Six outils pour co-décider
              </h2>
              <p className="lg:col-span-6 text-muted-foreground text-lg leading-relaxed max-w-[34rem]">
                Un écosystème complet pour rétablir la confiance entre étudiants et administration.
              </p>
            </div>

            <ul className="grid gap-x-16 md:grid-cols-2 border-t border-border">
              {features.map((f) => (
                <li key={f.id} className={`border-b border-border py-7 flex gap-4 ${f.tone}`}>
                  <span className="tone-tile inline-flex w-10 h-10 items-center justify-center rounded-lg shrink-0">
                    <f.icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-muted-foreground">{f.label}</p>
                    <h3 className="mt-0.5 text-lg md:text-xl font-bold leading-snug text-foreground">{f.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{f.description}</p>
                    <Link
                      href={f.href}
                      className="mt-3 inline-block text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                    >
                      {f.cta}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── COMMENT ÇA MARCHE (vraie séquence : numérotée) ──────────────── */}
        <section className="py-16 md:py-24 px-4 sm:px-6 bg-card border-y border-border" aria-labelledby="steps-title">
          <div className="max-w-6xl mx-auto">
            <h2 id="steps-title" className="text-3xl md:text-4xl font-extrabold tracking-tight mb-10 md:mb-12">
              Comment ça marche
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {steps.map((step) => (
                <li key={step.number}>
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-base font-bold tabular" aria-hidden="true">
                    {step.number}
                  </span>
                  <h3 className="mt-5 text-lg font-bold">
                    <span className="sr-only">Étape {step.number} : </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed max-w-[30rem]">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/agora.svg" alt="" width={30} height={30} className="shrink-0 logo-mark" />
            <div>
              <Agora360Wordmark className="text-lg leading-tight block" />
              <p className="text-sm text-muted-foreground">Gouvernance participative universitaire</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground hover:underline underline-offset-4">Connexion</Link>
            <Link href="/register" className="hover:text-foreground hover:underline underline-offset-4">Créer un compte</Link>
            <span>© 2025 Agora360</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
