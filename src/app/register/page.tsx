"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"

// ── Testimonials ──────────────────────────────────────────────────────────────

const testimonials = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Chloé Martin",
    handle: "@chloe.m",
    text: "Inscription en 2 minutes, ticket résolu en 24h. La plateforme est vraiment bien pensée.",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/45.jpg",
    name: "Thomas Lefebvre",
    handle: "@thomas.lef",
    text: "Enfin un outil qui centralise toutes mes démarches administratives au même endroit.",
  },
]

// ── Glass input ───────────────────────────────────────────────────────────────

const GlassInput = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-primary/60 focus-within:bg-primary/5">
    {children}
  </div>
)

// ── Testimonial card ──────────────────────────────────────────────────────────

const TestimonialCard = ({ t, delay }: { t: typeof testimonials[0]; delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-2xl glass border border-white/15 p-4 w-60 shrink-0`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={t.avatarSrc} className="h-10 w-10 rounded-xl object-cover shrink-0" alt={t.name} />
    <div className="text-sm leading-snug">
      <p className="font-semibold text-white">{t.name}</p>
      <p className="text-white/50 text-xs">{t.handle}</p>
      <p className="mt-1.5 text-white/80 text-xs leading-relaxed">{t.text}</p>
    </div>
  </div>
)

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || "Une erreur est survenue.")
      setLoading(false)
    } else {
      toast.success("Compte créé avec succès ! Vous pouvez vous connecter.")
      router.push("/login?registered=1")
    }
  }

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row overflow-hidden">

      {/* ── Left — form ── */}
      <section className="flex-1 flex items-start md:items-center justify-center pt-16 md:pt-0 p-8 bg-background">
        <motion.div
          className="w-full max-w-md flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Branding */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 w-fit hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/agora.svg" alt="Agora360" width={40} height={40} className="shrink-0" />
              <span className="font-extrabold text-xl tracking-tight text-gradient-primary">Agora360</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              Rejoignez-nous 🎓
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Créez votre compte et participez à la gouvernance de votre établissement
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="text-sm font-medium text-foreground/80">
                Nom complet
              </label>
              <GlassInput>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Prénom Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm px-4 py-3.5 rounded-xl focus:outline-none placeholder:text-muted-foreground/50"
                />
              </GlassInput>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-sm font-medium text-foreground/80">
                Email universitaire
              </label>
              <GlassInput>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="prenom.nom@univ.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm px-4 py-3.5 rounded-xl focus:outline-none placeholder:text-muted-foreground/50"
                />
              </GlassInput>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-password" className="text-sm font-medium text-foreground/80">
                Mot de passe
              </label>
              <GlassInput>
                <div className="relative">
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Minimum 8 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                    className="w-full bg-transparent text-sm px-4 py-3.5 pr-12 rounded-xl focus:outline-none placeholder:text-muted-foreground/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                      : <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    }
                  </button>
                </div>
              </GlassInput>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full rounded-xl py-3.5 text-sm font-bold text-white disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Création en cours…" : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              Se connecter
            </Link>
          </p>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/50">
            <Shield className="w-3 h-3" />
            Inscription sécurisée — données chiffrées
          </div>
        </motion.div>
      </section>

      {/* ── Right — hero + testimonials ── */}
      <motion.section
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden md:block flex-1 relative p-4"
      >
        {/* Hero image */}
        <div
          className="absolute inset-4 rounded-3xl bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=2160&q=80)",
          }}
        >
          {/* Rich gradient overlay */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/60 via-black/30 to-black/70" />
          {/* Top label */}
          <div className="absolute top-6 left-6 flex items-center gap-2 glass rounded-xl px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/90 text-xs font-medium">Rejoignez 2 400+ étudiants</span>
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 w-full px-8 justify-center">
          <TestimonialCard t={testimonials[0]} delay="animate-delay-1000" />
          <div className="hidden xl:flex">
            <TestimonialCard t={testimonials[1]} delay="animate-delay-1200" />
          </div>
        </div>
      </motion.section>

    </div>
  )
}
