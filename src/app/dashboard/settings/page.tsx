"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { User, Lock, Camera, Check } from "lucide-react"
import { FadeIn } from "@/components/animations"
import { Button } from "@/components/ui/button"

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-5">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

const inputCls = "w-full rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm focus:outline-none focus:border-primary/60 transition-colors"

// ── Avatar preview ────────────────────────────────────────────────────────────
function AvatarPreview({ src, name }: { src: string; name: string }) {
  const [valid, setValid] = useState(false)

  useEffect(() => { setValid(src.startsWith("http")) }, [src])

  return (
    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary/10 shrink-0 border-2 border-border flex items-center justify-center">
      {valid ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="w-full h-full object-cover" onError={() => setValid(false)} />
      ) : (
        <span className="text-primary font-bold text-2xl">{(name || "U").charAt(0).toUpperCase()}</span>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const router = useRouter()

  // Profile state
  const [name, setName]   = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole]   = useState("")
  const [image, setImage] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)

  // Password state
  const [currentPwd, setCurrentPwd] = useState("")
  const [newPwd, setNewPwd]         = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [pwdLoading, setPwdLoading] = useState(false)

  // Load profile from API
  useEffect(() => {
    fetch("/api/profil")
      .then((r) => { if (r.status === 401) { router.push("/login"); return null } return r.json() })
      .then((d) => {
        if (!d?.user) return
        setName(d.user.name ?? "")
        setEmail(d.user.email ?? "")
        setRole(d.user.role ?? "")
        setImage(d.user.image ?? "")
      })
  }, [router])

  // ── Save profile ────────────────────────────────────────────────────────────
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toast.error("Le nom ne peut pas être vide."); return }

    setProfileLoading(true)
    const res = await fetch("/api/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), image: image.trim() || null }),
    })

    if (!res.ok) { toast.error("Erreur lors de la mise à jour."); setProfileLoading(false); return }

    toast.success("Profil mis à jour.")
    setProfileLoading(false)
  }

  // ── Change password ─────────────────────────────────────────────────────────
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPwd !== confirmPwd) { toast.error("Les mots de passe ne correspondent pas."); return }
    if (newPwd.length < 8)    { toast.error("Le mot de passe doit faire au moins 8 caractères."); return }

    setPwdLoading(true)
    const res = await fetch("/api/profil/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
    })

    const data = await res.json()
    if (!res.ok) { toast.error(data.error ?? "Erreur lors du changement."); setPwdLoading(false); return }

    toast.success("Mot de passe mis à jour.")
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("")
    setPwdLoading(false)
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-xl font-bold text-foreground">Paramètres</h1>
          <p className="text-sm text-muted-foreground mt-1">Gérez votre profil et la sécurité de votre compte.</p>
        </div>
      </FadeIn>

      {/* ── Profil ── */}
      <FadeIn delay={0.05}>
        <Section title="Informations du profil" icon={User}>
          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <AvatarPreview src={image} name={name} />
              <Field
                label=""
                hint="Entrez l'URL d'une image accessible en ligne (jpg, png, webp…)"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground/80">Photo de profil (URL)</span>
                </div>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/ma-photo.jpg"
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Nom affiché">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                required
                className={inputCls}
              />
            </Field>

            <Field label="Adresse email" hint="L'adresse email ne peut pas être modifiée.">
              <input type="email" value={email} disabled className={inputCls + " opacity-50 cursor-not-allowed"} />
            </Field>

            <Field label="Rôle">
              <input
                type="text"
                value={role === "ADMIN" ? "Administration" : "Étudiant"}
                disabled
                className={inputCls + " opacity-50 cursor-not-allowed"}
              />
            </Field>

            <div className="flex justify-end pt-1">
              <Button type="submit" disabled={profileLoading} className="gap-2">
                {profileLoading ? "Enregistrement…" : <><Check className="w-4 h-4" />Enregistrer</>}
              </Button>
            </div>
          </form>
        </Section>
      </FadeIn>

      {/* ── Mot de passe ── */}
      <FadeIn delay={0.1}>
        <Section title="Changer le mot de passe" icon={Lock}>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Field label="Mot de passe actuel">
              <input
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className={inputCls}
              />
            </Field>

            <Field label="Nouveau mot de passe">
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="Minimum 8 caractères"
                minLength={8}
                required
                autoComplete="new-password"
                className={inputCls}
              />
            </Field>

            <Field label="Confirmer le nouveau mot de passe">
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Répétez le mot de passe"
                minLength={8}
                required
                autoComplete="new-password"
                className={inputCls}
              />
              {confirmPwd && newPwd !== confirmPwd && (
                <p className="text-xs text-destructive mt-1">Les mots de passe ne correspondent pas.</p>
              )}
            </Field>

            <div className="flex justify-end pt-1">
              <Button type="submit" disabled={pwdLoading} variant="outline" className="gap-2">
                {pwdLoading ? "Mise à jour…" : <><Lock className="w-4 h-4" />Mettre à jour</>}
              </Button>
            </div>
          </form>
        </Section>
      </FadeIn>
    </div>
  )
}
