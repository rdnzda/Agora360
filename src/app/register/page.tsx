"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"
import { AuthAside } from "@/components/auth/auth-aside"
import { Agora360Wordmark } from "@/components/logo"

// ── Champ de saisie ───────────────────────────────────────────────────────────

const FieldBox = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border border-input bg-card transition-colors focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20">
    {children}
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
      <section className="flex-1 flex items-start md:items-center justify-center pt-12 md:pt-0 px-5 py-8 sm:p-8 bg-background overflow-y-auto">
        <motion.div
          className="w-full max-w-md flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Branding */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-8 w-fit rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/agora.svg" alt="" width={36} height={36} className="shrink-0 logo-mark" />
              <Agora360Wordmark className="text-xl" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
              Rejoignez-nous
            </h1>
            <p className="text-muted-foreground mt-3 text-base">
              Créez votre compte et participez à la gouvernance de votre établissement
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="text-sm font-semibold text-foreground">
                Nom complet
              </label>
              <FieldBox>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Prénom Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm px-3.5 py-3 rounded-md focus:outline-none placeholder:text-muted-foreground/70"
                />
              </FieldBox>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-sm font-semibold text-foreground">
                Email universitaire
              </label>
              <FieldBox>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="prenom.nom@univ.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm px-3.5 py-3 rounded-md focus:outline-none placeholder:text-muted-foreground/70"
                />
              </FieldBox>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-password" className="text-sm font-semibold text-foreground">
                Mot de passe
              </label>
              <FieldBox>
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
                    className="w-full bg-transparent text-sm px-3.5 py-3 pr-12 rounded-md focus:outline-none placeholder:text-muted-foreground/70"
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
              </FieldBox>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full rounded-lg py-3 text-base font-semibold disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Création en cours…" : "Créer mon compte"}
            </button>
          </form>

          {/* Séparateur */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Bouton ENT — bientôt disponible */}
          <div className="relative">
            <button
              disabled
              className="w-full rounded-lg py-3 text-sm font-semibold border border-dashed border-input bg-transparent text-muted-foreground cursor-not-allowed flex items-center justify-center gap-2.5"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
              </svg>
              S'inscrire avec mon compte ENT
            </button>
            <span className="absolute -top-2 right-3 px-1.5 py-0.5 rounded-sm bg-background border border-border text-[11px] font-medium text-muted-foreground">
              Bientôt disponible
            </span>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-primary font-semibold underline underline-offset-4 hover:no-underline">
              Se connecter
            </Link>
          </p>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            Inscription sécurisée, données chiffrées
          </div>
        </motion.div>
      </section>

      <AuthAside />

    </div>
  )
}
