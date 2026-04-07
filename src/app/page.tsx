import Link from "next/link"
import {
  Ticket, BarChart2, Wallet, Landmark, UserCircle, LayoutDashboard,
  ArrowRight, ChevronDown, Users, CheckCircle, Vote, Star, Zap, Shield,
} from "lucide-react"
import { LandingNavbar } from "@/components/landing-navbar"
import { ScrollReveal, StaggerGrid, StaggerGridItem, CountUp } from "@/components/animations"
import { Agora360Icon } from "@/components/logo"

// ── Testimonials data ────────────────────────────────────────────────────────
const testimonials = [
  {
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Emma Durand",
    handle: "@emma.durand",
    text: "Mon problème de logement universitaire a été résolu en moins de 48h. Vraiment efficace !",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Lucas Bernard",
    handle: "@lucas.b",
    text: "Interface claire, réponses rapides. Je recommande à tous les étudiants de l'établissement.",
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Sofia Reyes",
    handle: "@sofia.r",
    text: "Le budget participatif m'a permis de voter pour une salle de coworking. Elle est ouverte depuis mars !",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    name: "Antoine Moreau",
    handle: "@antoine.m",
    text: "J'ai été tiré au sort pour le Parlement Éphémère. Une expérience unique de co-décision.",
  },
]

// ── Features data ─────────────────────────────────────────────────────────────
const features = [
  {
    id: "gps",
    icon: Ticket,
    label: "GPS Admin",
    title: "Suivez vos dossiers en temps réel",
    description: "Comme un colis, trackez l'avancement de vos demandes administratives étape par étape. Plus d'incertitude.",
    variant: "bento-indigo",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    size: "large",
  },
  {
    id: "budget",
    icon: Wallet,
    label: "Budget Participatif",
    title: "Votez pour les projets campus",
    description: "Allouez le budget annuel aux projets qui comptent vraiment pour vous.",
    variant: "bento-teal",
    iconColor: "text-accent",
    iconBg: "bg-accent/10",
    size: "small",
  },
  {
    id: "parlement",
    icon: Landmark,
    label: "Parlement Éphémère",
    title: "Co-décidez avec l'administration",
    description: "Tirage au sort mensuel pour siéger comme député étudiant et co-créer les décisions campus.",
    variant: "bento-violet",
    iconColor: "text-[oklch(0.62_0.20_330)]",
    iconBg: "bg-[oklch(0.62_0.20_330/0.1)]",
    size: "small",
  },
  {
    id: "barometre",
    icon: BarChart2,
    label: "Baromètre Campus",
    title: "Exprimez votre vécu chaque semaine",
    description: "Sondage hebdomadaire anonyme sur le climat et le bien-être de votre campus.",
    variant: "bento-amber",
    iconColor: "text-[oklch(0.65_0.19_47)]",
    iconBg: "bg-[oklch(0.72_0.19_47/0.1)]",
    size: "small",
  },
  {
    id: "gamification",
    icon: Star,
    label: "Profil & Gamification",
    title: "Chaque action compte",
    description: "Points, badges et une Carte d'Impact certifiable sur LinkedIn pour valoriser votre engagement.",
    variant: "bento-rose",
    iconColor: "text-[oklch(0.68_0.20_10)]",
    iconBg: "bg-[oklch(0.68_0.20_10/0.1)]",
    size: "small",
  },
]

// ── Steps data ────────────────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    icon: Users,
    title: "Créez votre compte",
    description: "Inscrivez-vous avec votre email universitaire et accédez instantanément à toutes les fonctionnalités.",
  },
  {
    number: "02",
    icon: Vote,
    title: "Participez activement",
    description: "Soumettez des tickets, votez sur les budgets, candidatez au Parlement, répondez au Baromètre.",
  },
  {
    number: "03",
    icon: Zap,
    title: "Suivez votre impact",
    description: "Gagnez des points, débloquez des badges et mesurez votre contribution au campus.",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingNavbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Fond très discret — simple teinte radiale */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.42 0.19 270 / 0.07) 0%, transparent 70%)" }} />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 py-24">
          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-sm font-medium text-primary mb-8">
            <Shield className="w-3.5 h-3.5" />
            Plateforme de gouvernance universitaire
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight mb-6">
            <span className="text-gradient-primary">La voix</span>
            <br />
            <span className="text-foreground">de votre campus</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Agora360 réunit étudiants et administration dans une gouvernance transparente et participative.
            Suivez vos dossiers, votez, co-décidez — tout en un.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="btn-primary flex items-center gap-2 font-semibold px-8 py-4 rounded-2xl text-base"
            >
              Accéder au tableau de bord
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              Créer un compte
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground/60 text-xs">
              <span>Découvrir</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-border bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { value: 2400, suffix: "+", label: "étudiants connectés" },
                { value: 98, suffix: "%", label: "tickets résolus" },
                { value: 1200, suffix: "+", label: "votes participatifs" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <div className="text-3xl md:text-5xl font-extrabold text-gradient-primary">
                    <CountUp value={stat.value} suffix={stat.suffix} duration={1.2} />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FEATURES BENTO ────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Fonctionnalités</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              6 outils pour co-décider
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
              Un écosystème complet pour rétablir la confiance entre étudiants et administration.
            </p>
          </ScrollReveal>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">
            {/* Large card — GPS Admin */}
            <StaggerGridItem className="md:col-span-2">
              <div className="bg-card card-shadow card-hover rounded-3xl border border-border p-8 h-full min-h-[260px] flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
                    <Ticket className="w-6 h-6 text-primary" />
                  </div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-3">
                    GPS Admin
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3">Suivez vos dossiers en temps réel</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Comme un colis, trackez l&apos;avancement de vos demandes administratives étape par étape.
                    Scolarité, logement, informatique — plus d&apos;incertitude.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                  Soumettre un ticket <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </StaggerGridItem>

            {/* Budget Participatif */}
            <StaggerGridItem>
              <div className="bg-card card-shadow card-hover rounded-3xl border border-border p-6 h-full min-h-[260px] flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center mb-4">
                    <Wallet className="w-6 h-6 text-accent" />
                  </div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wide mb-3">
                    Budget Participatif
                  </div>
                  <h3 className="text-lg font-bold mb-2">Votez pour les projets campus</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Allouez le budget annuel aux projets qui comptent vraiment pour vous.
                  </p>
                </div>
              </div>
            </StaggerGridItem>

            {/* Parlement Éphémère */}
            <StaggerGridItem>
              <div className="bg-card card-shadow card-hover rounded-3xl border border-border p-6 h-full min-h-[220px] flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[oklch(0.62_0.20_330/0.12)] flex items-center justify-center mb-4">
                    <Landmark className="w-6 h-6 text-[oklch(0.50_0.20_310)]" />
                  </div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-[oklch(0.62_0.20_330/0.1)] text-[oklch(0.45_0.20_310)] text-xs font-semibold uppercase tracking-wide mb-3">
                    Parlement Éphémère
                  </div>
                  <h3 className="text-lg font-bold mb-2">Co-décidez avec l&apos;administration</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Tirage au sort mensuel pour siéger comme député étudiant.
                  </p>
                </div>
              </div>
            </StaggerGridItem>

            {/* Baromètre */}
            <StaggerGridItem>
              <div className="bg-card card-shadow card-hover rounded-3xl border border-border p-6 h-full min-h-[220px] flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[oklch(0.72_0.19_47/0.12)] flex items-center justify-center mb-4">
                    <BarChart2 className="w-6 h-6 text-[oklch(0.60_0.19_47)]" />
                  </div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-[oklch(0.72_0.19_47/0.1)] text-[oklch(0.55_0.19_47)] text-xs font-semibold uppercase tracking-wide mb-3">
                    Baromètre Campus
                  </div>
                  <h3 className="text-lg font-bold mb-2">Exprimez votre vécu chaque semaine</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Sondage hebdomadaire anonyme sur le bien-être campus.
                  </p>
                </div>
              </div>
            </StaggerGridItem>

            {/* Gamification */}
            <StaggerGridItem>
              <div className="bg-card card-shadow card-hover rounded-3xl border border-border p-6 h-full min-h-[220px] flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[oklch(0.68_0.20_10/0.12)] flex items-center justify-center mb-4">
                    <UserCircle className="w-6 h-6 text-[oklch(0.55_0.20_10)]" />
                  </div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-[oklch(0.68_0.20_10/0.1)] text-[oklch(0.50_0.20_10)] text-xs font-semibold uppercase tracking-wide mb-3">
                    Profil & Gamification
                  </div>
                  <h3 className="text-lg font-bold mb-2">Chaque action compte</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Points, badges et Carte d&apos;Impact LinkedIn pour valoriser votre engagement.
                  </p>
                </div>
              </div>
            </StaggerGridItem>

            {/* Dashboard — wide card */}
            <StaggerGridItem className="md:col-span-3">
              <div className="bg-[oklch(0.14_0.025_278)] card-hover rounded-3xl border border-[oklch(1_0_0/0.08)] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-start gap-5 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <LayoutDashboard className="w-6 h-6 text-white/80" />
                  </div>
                  <div>
                    <div className="inline-block px-2.5 py-1 rounded-md bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-wide mb-3">
                      Tableau de bord
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Votre campus, en un coup d&apos;œil</h3>
                    <p className="text-white/60 leading-relaxed max-w-xl">
                      Vue consolidée de tous vos tickets, votes et participations. Statistiques en temps réel pour les administrateurs.
                    </p>
                  </div>
                </div>
                {/* Mini stat cards preview */}
                <div className="grid grid-cols-2 gap-2 shrink-0">
                  {[
                    { icon: Ticket, label: "Tickets", value: "12", color: "text-primary" },
                    { icon: BarChart2, label: "Réponses", value: "48", color: "text-accent" },
                    { icon: Wallet, label: "Votes", value: "7", color: "text-[oklch(0.72_0.19_47)]" },
                    { icon: Landmark, label: "Sessions", value: "3", color: "text-[oklch(0.62_0.20_330)]" },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10 w-28">
                      <item.icon className={`w-4 h-4 ${item.color} mb-1.5`} />
                      <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                      <div className="text-white/40 text-xs">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </StaggerGridItem>
          </StaggerGrid>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-secondary/20 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Comment ça marche</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">En 3 étapes simples</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Dotted connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px border-t-2 border-dashed border-border z-0" />

            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.1} className="relative z-10">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center relative">
                    <step.icon className="w-8 h-8 text-primary" />
                    <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {step.number.replace("0", "")}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Témoignages</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ce qu&apos;ils en disent</h2>
          </ScrollReveal>

          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {testimonials.map((t, i) => (
              <StaggerGridItem key={t.name}>
                <div className="bg-card card-shadow card-hover rounded-2xl p-6 border border-border">
                  <div className="flex items-start gap-4 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-muted-foreground text-xs">{t.handle}</p>
                    </div>
                    <div className="ml-auto">
                      <CheckCircle className="w-4 h-4 text-accent" />
                    </div>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">{t.text}</p>
                </div>
              </StaggerGridItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-[oklch(0.50_0.21_285)] to-accent" />
              {/* Overlay noise texture */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(1_0_0/0.15)_0%,transparent_60%)]" />

              <div className="relative z-10 text-center px-8 py-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium mb-6">
                  <Zap className="w-3.5 h-3.5" />
                  Gratuit pour votre campus
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                  Rejoignez votre campus
                  <br />
                  dès aujourd&apos;hui
                </h2>
                <p className="text-white/70 text-lg mb-10 max-w-lg mx-auto">
                  Créez votre compte avec votre email universitaire et participez à la gouvernance de votre établissement.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-2xl hover:bg-white/90 transition-colors"
                  >
                    Créer un compte gratuit
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/25 transition-colors border border-white/20"
                  >
                    Déjà inscrit ? Connexion
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-secondary/20 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <Agora360Icon className="text-white" size={18} />
            </div>
            <div>
              <p className="font-extrabold text-gradient-primary">Agora360</p>
              <p className="text-xs text-muted-foreground">Gouvernance participative universitaire</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">Connexion</Link>
            <Link href="/register" className="hover:text-foreground transition-colors">Créer un compte</Link>
            <span>© 2025 Agora360</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
