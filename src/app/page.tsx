import Link from "next/link"
import {
  Ticket, BarChart2, Wallet, Landmark, UserCircle, LayoutDashboard, ArrowRight,
} from "lucide-react"
import { LandingNavbar } from "@/components/landing-navbar"
import { ScrollReveal } from "@/components/animations"

// ── Modules ───────────────────────────────────────────────────────────────────
const features = [
  {
    id: "gps",
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
    icon: Wallet,
    label: "Budget participatif",
    title: "Votez pour les projets campus",
    description: "Allouez le budget annuel aux projets qui comptent vraiment pour vous.",
    href: "/dashboard/budget",
    cta: "Voir les projets",
  },
  {
    id: "parlement",
    icon: Landmark,
    label: "Parlement éphémère",
    title: "Co-décidez avec l'administration",
    description: "Tirage au sort mensuel pour siéger comme député étudiant et co-créer les décisions campus.",
    href: "/dashboard/parlement",
    cta: "Voir les sessions",
  },
  {
    id: "barometre",
    icon: BarChart2,
    label: "Baromètre campus",
    title: "Exprimez votre vécu chaque semaine",
    description: "Sondage hebdomadaire anonyme sur le climat et le bien-être de votre campus.",
    href: "/dashboard/barometre",
    cta: "Répondre au baromètre",
  },
  {
    id: "profil",
    icon: UserCircle,
    label: "Profil et engagement",
    title: "Chaque action compte",
    description: "Points, badges et une Carte d'Impact certifiable sur LinkedIn pour valoriser votre engagement.",
    href: "/dashboard/profil",
    cta: "Voir mon profil",
  },
  {
    id: "dashboard",
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
        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="border-b border-border px-4 sm:px-6">
          <div className="max-w-6xl mx-auto pt-14 pb-16 md:pt-24 md:pb-24 grid gap-10 lg:grid-cols-12 lg:gap-12 items-end">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-3 text-sm font-semibold text-primary mb-6">
                <span aria-hidden="true" className="inline-block w-8 h-0.5 bg-primary" />
                Plateforme de gouvernance universitaire
              </p>
              <h1 className="text-[2.75rem] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tight text-foreground">
                La voix de votre campus.
              </h1>
            </div>

            <div className="lg:col-span-5 lg:pb-3">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Agora360 réunit étudiants et administration dans une gouvernance transparente et
                participative. <span className="text-foreground">Suivez vos dossiers, votez, co-décidez</span> — tout en un.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <Link
                  href="/dashboard"
                  className="btn-primary inline-flex items-center justify-center gap-2 font-semibold px-5 py-3 rounded-md text-base"
                >
                  Accéder au tableau de bord
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-1 py-3 text-base font-semibold text-foreground underline decoration-border decoration-2 underline-offset-[6px] hover:decoration-primary transition-colors"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── MODULES ───────────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 px-4 sm:px-6" aria-labelledby="modules-title">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal className="grid gap-4 lg:grid-cols-12 lg:gap-12 mb-10 md:mb-14">
              <h2 id="modules-title" className="lg:col-span-7 text-3xl md:text-5xl font-semibold tracking-tight">
                Six outils pour co-décider
              </h2>
              <p className="lg:col-span-5 text-muted-foreground text-lg leading-relaxed lg:pt-2">
                Un écosystème complet pour rétablir la confiance entre étudiants et administration.
              </p>
            </ScrollReveal>

            <ol className="border-t-2 border-foreground">
              {features.map((f, i) => (
                <li key={f.id} className="border-b border-border">
                  <Link
                    href={f.href}
                    className="group grid grid-cols-[2.25rem_1fr] md:grid-cols-[3.5rem_14rem_1fr_auto] gap-x-4 gap-y-1 py-6 md:py-7 items-baseline hover:bg-muted/60 transition-colors -mx-2 px-2 rounded-sm"
                  >
                    <span className="tabular text-sm font-semibold text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <f.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {f.label}
                    </span>
                    <span className="col-start-2 md:col-start-auto">
                      <span className="block font-serif text-xl md:text-2xl font-semibold leading-snug text-foreground">
                        {f.title}
                      </span>
                      <span className="block mt-1.5 text-muted-foreground leading-relaxed max-w-2xl">
                        {f.description}
                      </span>
                    </span>
                    <span className="col-start-2 md:col-start-auto mt-2 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:text-primary whitespace-nowrap">
                      {f.cta}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── COMMENT ÇA MARCHE ─────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 px-4 sm:px-6 bg-secondary border-y border-border" aria-labelledby="steps-title">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal className="mb-10 md:mb-14">
              <h2 id="steps-title" className="text-3xl md:text-4xl font-semibold tracking-tight">
                Comment ça marche
              </h2>
            </ScrollReveal>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
              {steps.map((step) => (
                <li key={step.number} className="bg-card p-6 md:p-8">
                  <span className="block font-serif text-5xl font-semibold text-primary leading-none tabular" aria-hidden="true">
                    {step.number}
                  </span>
                  <h3 className="mt-6 text-lg font-bold">
                    <span className="sr-only">Étape {step.number} : </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── APPEL À L'ACTION ──────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto panel-civic rounded-md px-6 py-10 md:px-12 md:py-14 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
                Rejoignez votre campus dès aujourd&apos;hui
              </h2>
              <p className="mt-4 text-lg leading-relaxed opacity-85 max-w-xl">
                Créez votre compte avec votre email universitaire et participez à la gouvernance de votre établissement.
              </p>
            </div>
            <div className="lg:col-span-6 flex flex-col sm:flex-row lg:justify-end gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-background text-foreground font-semibold px-5 py-3 rounded-md hover:bg-background/90 transition-colors"
              >
                Créer un compte gratuit
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center whitespace-nowrap px-5 py-3 rounded-md font-semibold border border-current/40 hover:bg-white/10 transition-colors"
              >
                Déjà inscrit ? Connexion
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/agora.svg" alt="" width={28} height={28} className="shrink-0" />
            <div>
              <p className="font-serif text-lg font-semibold leading-tight">Agora360</p>
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
