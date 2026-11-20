import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { FadeIn, StaggerList, StaggerItem } from "@/components/animations"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingBag,
  Lock,
  Sparkles,
  Star,
  Ticket,
  BookOpen,
  Coffee,
  Award,
  Users,
  FileText,
  Zap,
  Gift,
  Tag,
  HandCoins,
} from "lucide-react"

// ── Reward catalog ────────────────────────────────────────────────────────────

const REWARDS = [
  {
    id: "priority_ticket",
    icon: Zap,
    iconColor: "text-[oklch(0.72_0.22_278)]",
    bgColor: "bg-[oklch(0.72_0.22_278)]/10",
    name: "Priorité de traitement",
    description: "Votre prochain ticket GPS Admin sera traité en priorité absolue sous 12h.",
    cost: 300,
    category: "Services",
  },
  {
    id: "ru_discount",
    icon: Coffee,
    iconColor: "text-[oklch(0.72_0.19_47)]",
    bgColor: "bg-[oklch(0.72_0.19_47)]/10",
    name: "Réduction restaurant",
    description: "10 % de réduction sur votre prochain repas au Restaurant Universitaire.",
    cost: 250,
    category: "Avantages",
  },
  {
    id: "certified_badge",
    icon: Award,
    iconColor: "text-[oklch(0.72_0.20_90)]",
    bgColor: "bg-[oklch(0.72_0.20_90)]/10",
    name: "Badge certifié",
    description: "Un badge doré « Citoyen certifié » visible sur votre profil Agora360.",
    cost: 200,
    category: "Profil",
  },
  {
    id: "library_plus",
    icon: BookOpen,
    iconColor: "text-[oklch(0.72_0.19_195)]",
    bgColor: "bg-[oklch(0.72_0.19_195)]/10",
    name: "Accès Médiathèque+",
    description: "Prolongez vos emprunts et accédez aux ressources numériques premium 30 jours.",
    cost: 500,
    category: "Services",
  },
  {
    id: "coaching",
    icon: Star,
    iconColor: "text-[oklch(0.72_0.19_330)]",
    bgColor: "bg-[oklch(0.72_0.19_330)]/10",
    name: "Séance de coaching",
    description: "Une session individuelle d'orientation avec un conseiller pédagogique (1h).",
    cost: 800,
    category: "Accompagnement",
  },
  {
    id: "room_booking",
    icon: Users,
    iconColor: "text-[oklch(0.68_0.20_10)]",
    bgColor: "bg-[oklch(0.68_0.20_10)]/10",
    name: "Réservation prioritaire",
    description: "Accès prioritaire à la réservation des salles de travail en groupe pour 1 mois.",
    cost: 600,
    category: "Services",
  },
  {
    id: "jury",
    icon: Ticket,
    iconColor: "text-[oklch(0.70_0.22_278)]",
    bgColor: "bg-[oklch(0.70_0.22_278)]/10",
    name: "Participation jury",
    description: "Siégez dans un jury de concours ou d'admission en tant que représentant étudiant.",
    cost: 1200,
    category: "Gouvernance",
  },
  {
    id: "recommendation",
    icon: FileText,
    iconColor: "text-[oklch(0.65_0.05_240)]",
    bgColor: "bg-[oklch(0.65_0.05_240)]/10",
    name: "Lettre de recommandation",
    description: "Une lettre de recommandation officielle signée par le président du jury étudiant.",
    cost: 1500,
    category: "Académique",
  },
  {
    id: "welcome_pack",
    icon: Gift,
    iconColor: "text-[oklch(0.72_0.20_90)]",
    bgColor: "bg-[oklch(0.72_0.20_90)]/10",
    name: "Pack de bienvenue",
    description: "Kit goodies Agora360 : carnet, stylo, pin's — livré directement à la scolarité.",
    cost: 400,
    category: "Cadeaux",
  },
]

// ── Partner voucher catalog ───────────────────────────────────────────────────

const PARTNERS = [
  {
    id: "fnac",
    initials: "FN",
    bg: "bg-[oklch(0.30_0.03_240)]",
    text: "text-[oklch(0.90_0.05_60)]",
    name: "Fnac",
    offer: "−10 % sur livres & fournitures",
    description: "Bon de réduction valable en ligne et en magasin sur toute la catégorie Livres, papeterie et accessoires informatiques.",
    cost: 350,
    tag: "Culture & Tech",
  },
  {
    id: "sncf",
    initials: "SN",
    bg: "bg-[oklch(0.55_0.22_28)]",
    text: "text-white",
    name: "SNCF Connect",
    offer: "−15 % sur un billet TER",
    description: "Code promo pour 15 % de réduction sur un billet TER ou Intercités. Idéal pour rentrer chez vous le week-end.",
    cost: 400,
    tag: "Mobilité",
  },
  {
    id: "spotify",
    initials: "SP",
    bg: "bg-[oklch(0.55_0.22_148)]",
    text: "text-white",
    name: "Spotify",
    offer: "3 mois Premium offerts",
    description: "Profitez de 3 mois d'abonnement Spotify Premium sans publicité, en qualité audio maximale.",
    cost: 600,
    tag: "Divertissement",
  },
  {
    id: "amazon",
    initials: "AZ",
    bg: "bg-[oklch(0.72_0.19_60)]",
    text: "text-[oklch(0.20_0.02_60)]",
    name: "Amazon",
    offer: "2 mois Prime Student",
    description: "Accédez à Amazon Prime Student gratuitement pendant 2 mois supplémentaires : livraison rapide, Prime Video, Prime Reading.",
    cost: 500,
    tag: "Shopping",
  },
  {
    id: "decathlon",
    initials: "DC",
    bg: "bg-[oklch(0.50_0.22_265)]",
    text: "text-white",
    name: "Decathlon",
    offer: "−20 % sur une commande",
    description: "Bon de réduction de 20 % valable sur une commande en ligne ou en magasin, sans minimum d'achat.",
    cost: 450,
    tag: "Sport",
  },
  {
    id: "uber_eats",
    initials: "UE",
    bg: "bg-[oklch(0.25_0.02_240)]",
    text: "text-[oklch(0.85_0.12_100)]",
    name: "Uber Eats",
    offer: "5 € offerts sur votre commande",
    description: "Code de réduction de 5 € utilisable sur n'importe quelle commande passée depuis le campus.",
    cost: 200,
    tag: "Restauration",
  },
  {
    id: "boulanger",
    initials: "BG",
    bg: "bg-[oklch(0.55_0.22_28)]",
    text: "text-white",
    name: "Boulanger",
    offer: "−5 % sur l'électroménager",
    description: "Remise de 5 % sur votre prochain achat électroménager ou high-tech en magasin ou sur boulanger.com.",
    cost: 300,
    tag: "High-Tech",
  },
  {
    id: "crous",
    initials: "CR",
    bg: "bg-[oklch(0.48_0.20_278)]",
    text: "text-white",
    name: "CROUS",
    offer: "10 repas au tarif social",
    description: "Accédez au tarif préférentiel CROUS (1 €) pour 10 repas supplémentaires dans les restaurants universitaires du réseau.",
    cost: 250,
    tag: "Campus",
  },
]

// ── Partner card ──────────────────────────────────────────────────────────────

function PartnerCard({ partner }: { partner: (typeof PARTNERS)[0] }) {
  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 overflow-hidden group">
      {/* Coming soon ribbon */}
      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-muted px-2 py-0.5">
        <span className="text-[10px] font-medium text-muted-foreground/60">Bientôt</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-xl ${partner.bg} flex items-center justify-center shrink-0 opacity-70`}>
          <span className={`text-xs font-extrabold tracking-tight ${partner.text}`}>{partner.initials}</span>
        </div>
        <div className="min-w-0 pr-10">
          <p className="text-sm font-semibold text-foreground/50 truncate">{partner.name}</p>
          <p className="text-xs font-medium text-primary/60 truncate">{partner.offer}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/50 leading-relaxed line-clamp-2">
        {partner.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border/40 mt-auto">
        <div className="flex items-center gap-1.5">
          <HandCoins className="w-3.5 h-3.5 text-muted-foreground/40" />
          <span className="text-sm font-bold tabular-nums text-muted-foreground/40">
            {partner.cost.toLocaleString("fr-FR")} pts
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] text-muted-foreground/40 border-border/40">
          {partner.tag}
        </Badge>
      </div>
    </div>
  )
}

// ── Reward card ───────────────────────────────────────────────────────────────

function RewardCard({
  reward,
  totalPoints,
}: {
  reward: (typeof REWARDS)[0]
  totalPoints: number
}) {
  const unlocked = totalPoints >= reward.cost
  const Icon = reward.icon

  return (
    <div
      className={`relative flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-200 ${
        unlocked
          ? "bg-card border-border hover:border-primary/40 hover:shadow-sm"
          : "bg-card/50 border-border/50"
      }`}
    >
      {/* Lock overlay badge */}
      {!unlocked && (
        <div className="absolute top-3.5 right-3.5">
          <div className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1">
            <Lock className="w-3 h-3 text-muted-foreground/60" />
            <span className="text-[10px] font-medium text-muted-foreground/60">
              {reward.cost - totalPoints} pts manquants
            </span>
          </div>
        </div>
      )}

      {/* Icon */}
      <div className={`w-11 h-11 rounded-xl ${reward.bgColor} flex items-center justify-center shrink-0 ${!unlocked ? "opacity-40" : ""}`}>
        <Icon className={`w-5 h-5 ${reward.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-start gap-2 pr-6">
          <h3 className={`text-sm font-semibold leading-tight ${unlocked ? "text-foreground" : "text-foreground/40"}`}>
            {reward.name}
          </h3>
        </div>
        <p className={`text-xs leading-relaxed ${unlocked ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
          {reward.description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border/60 mt-auto">
        <div className="flex items-center gap-1.5">
          <Sparkles className={`w-3.5 h-3.5 ${unlocked ? "text-primary" : "text-muted-foreground/40"}`} />
          <span className={`text-sm font-bold tabular-nums ${unlocked ? "text-primary" : "text-muted-foreground/40"}`}>
            {reward.cost.toLocaleString("fr-FR")} pts
          </span>
        </div>
        <Badge
          variant={unlocked ? "default" : "outline"}
          className={`text-[10px] ${
            unlocked
              ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/10"
              : "text-muted-foreground/40 border-border/50"
          }`}
        >
          {reward.category}
        </Badge>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BoutiquePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const userId = session.user.id

  const pointsAgg = await prisma.pointTransaction.aggregate({
    where: { userId },
    _sum: { points: true },
  })

  const totalPoints = pointsAgg._sum.points ?? 0
  const unlockedCount = REWARDS.filter((r) => totalPoints >= r.cost).length

  return (
    <div className="p-4 md:p-8 space-y-6">

      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Boutique</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Échangez vos points contre des avantages exclusifs au sein de votre établissement.
            </p>
          </div>

          {/* Coming soon banner */}
          <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 shrink-0">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-medium text-primary/80">Bientôt disponible</span>
          </div>
        </div>
      </FadeIn>

      {/* Points balance card */}
      <FadeIn delay={0.05}>
        <div className="bg-primary/5 rounded-sm border border-primary/25 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Votre solde de points
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-foreground tabular-nums">
                  {totalPoints.toLocaleString("fr-FR")}
                </span>
                <span className="text-sm font-medium text-primary">points</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {unlockedCount} récompense{unlockedCount !== 1 ? "s" : ""} débloquée{unlockedCount !== 1 ? "s" : ""} sur {REWARDS.length}
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background/60 rounded-xl border border-border px-4 py-3">
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground/60">Min requis</span>
                <span className="font-bold text-foreground tabular-nums">200</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground/60">Max requis</span>
                <span className="font-bold text-foreground tabular-nums">1 500</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground/60">Articles</span>
                <span className="font-bold text-foreground tabular-nums">{REWARDS.length}</span>
              </div>
            </div>
          </div>

          {/* Progress bar toward next unlock */}
          {unlockedCount < REWARDS.length && (() => {
            const nextReward = REWARDS
              .filter((r) => r.cost > totalPoints)
              .sort((a, b) => a.cost - b.cost)[0]
            if (!nextReward) return null
            const progress = Math.min(100, Math.round((totalPoints / nextReward.cost) * 100))
            return (
              <div className="mt-4 pt-4 border-t border-primary/15">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">
                    Prochain déverrouillage — <span className="font-medium text-foreground">{nextReward.name}</span>
                  </span>
                  <span className="text-xs font-bold text-primary">{progress}%</span>
                </div>
                <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Encore <span className="font-semibold text-foreground">{(nextReward.cost - totalPoints).toLocaleString("fr-FR")} pts</span> nécessaires
                </p>
              </div>
            )
          })()}
        </div>
      </FadeIn>

      {/* How to earn points */}
      <FadeIn delay={0.08}>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs font-semibold text-foreground/70 mb-3 uppercase tracking-wide">
            Comment gagner des points ?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Répondre à une FAQ",    pts: "+25 pts",  color: "text-[oklch(0.68_0.18_150)]" },
              { label: "Répondre au baromètre", pts: "+30 pts",  color: "text-[oklch(0.72_0.19_47)]"  },
              { label: "Voter pour un projet",  pts: "+20 pts",  color: "text-[oklch(0.72_0.19_195)]" },
              { label: "Participer au parlement", pts: "+100 pts", color: "text-[oklch(0.72_0.19_330)]" },
            ].map((tip) => (
              <div key={tip.label} className="flex flex-col gap-0.5 rounded-xl bg-muted/40 px-3 py-2.5">
                <span className={`text-sm font-bold tabular-nums ${tip.color}`}>{tip.pts}</span>
                <span className="text-xs text-muted-foreground leading-tight">{tip.label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Rewards grid */}
      <FadeIn delay={0.12}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Récompenses disponibles</h2>
            <span className="text-xs text-muted-foreground">
              {unlockedCount}/{REWARDS.length} débloquées
            </span>
          </div>
          <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REWARDS.sort((a, b) => a.cost - b.cost).map((reward) => (
              <StaggerItem key={reward.id}>
                <RewardCard reward={reward} totalPoints={totalPoints} />
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </FadeIn>

      {/* Partner vouchers */}
      <FadeIn delay={0.16}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Bons d'achat partenaires</h2>
            </div>
            <div className="flex items-center gap-1.5 bg-muted/60 rounded-lg px-2.5 py-1">
              <Sparkles className="w-3 h-3 text-muted-foreground/60" />
              <span className="text-[10px] font-medium text-muted-foreground/60">Bientôt disponible</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Des partenariats exclusifs avec des enseignes et services du quotidien. Échangez vos points contre des bons de réduction directement utilisables.
          </p>
          <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PARTNERS.map((partner) => (
              <StaggerItem key={partner.id}>
                <PartnerCard partner={partner} />
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </FadeIn>

      {/* Disclaimer */}
      <FadeIn delay={0.22}>
        <p className="text-center text-xs text-muted-foreground/50 pb-2">
          La boutique est actuellement en aperçu. L'échange de points et les bons partenaires seront disponibles lors du lancement officiel de la plateforme.
        </p>
      </FadeIn>

    </div>
  )
}
