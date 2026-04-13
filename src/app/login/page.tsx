"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

// ── Testimonials ──────────────────────────────────────────────────────────────

const testimonials = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Emma Durand",
    handle: "@emma.durand",
    text: "Mon problème de logement universitaire a été résolu en moins de 48h. Vraiment efficace !",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Lucas Bernard",
    handle: "@lucas.b",
    text: "Interface claire, réponses rapides. Je recommande à tous les étudiants de l'établissement.",
  },
]

// ── Glass input ───────────────────────────────────────────────────────────────

const GlassInput = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-primary/60 focus-within:bg-primary/5">
    {children}
  </div>
)

// ── Testimonial card ���─────────────────────────────────────────────────────────

const TestimonialCard = ({ t, delay }: { t: typeof testimonials[0]; delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-2xl glass border border-white/15 p-4 w-60 shrink-0`}>
    <Image src={t.avatarSrc} width={40} height={40} className="rounded-xl object-cover shrink-0" alt={t.name} />
    <div className="text-sm leading-snug">
      <p className="font-semibold text-white">{t.name}</p>
      <p className="text-white/50 text-xs">{t.handle}</p>
      <p className="mt-1.5 text-white/80 text-xs leading-relaxed">{t.text}</p>
    </div>
  </div>
)

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      toast.error("Email ou mot de passe incorrect.")
      setLoading(false)
    } else {
      toast.success("Connexion réussie !")
      window.location.href = "/dashboard"
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
              Bon retour 👋
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Connectez-vous à votre espace de gouvernance participative
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-sm font-medium text-foreground/80">
                Email universitaire
              </label>
              <GlassInput>
                <input
                  id="login-email"
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
              <label htmlFor="login-password" className="text-sm font-medium text-foreground/80">
                Mot de passe
              </label>
              <GlassInput>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Connexion en cours…" : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              Créer un compte
            </Link>
          </p>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/50">
            <Shield className="w-3 h-3" />
            Connexion sécurisée — données chiffrées
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
              "url(https://images.unsplash.com/20/cambridge.JPG?q=80&w=1694&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          }}
        >
          {/* Rich gradient overlay */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/60 via-black/30 to-black/70" />
          {/* Top label */}
          <div className="absolute top-6 left-6 flex items-center gap-2 glass rounded-xl px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/90 text-xs font-medium">Plateforme active</span>
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
