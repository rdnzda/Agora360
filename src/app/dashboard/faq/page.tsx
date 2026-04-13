"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { FadeIn } from "@/components/animations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MessageCircleQuestion,
  ChevronDown,
  CheckCircle2,
  CircleDot,
  Sparkles,
  SendHorizonal,
  Check,
  X,
  Plus,
  MessageSquare,
  Clock,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

type Author = {
  id: string
  name: string
  image: string | null
  role: "STUDENT" | "ADMIN"
}

type FaqAnswerType = {
  id: string
  body: string
  accepted: boolean
  createdAt: string
  author: Author
}

type FaqQuestionType = {
  id: string
  title: string
  body: string | null
  resolved: boolean
  createdAt: string
  author: Author
  answers: FaqAnswerType[]
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ user, size = "sm" }: { user: Author; size?: "sm" | "md" }) {
  const dim = size === "md" ? "w-9 h-9 text-sm" : "w-7 h-7 text-xs"
  return (
    <div className={`${dim} rounded-xl overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center`}>
      {user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-primary">{user.name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  )
}

// ── Answer ────────────────────────────────────────────────────────────────────

function AnswerCard({
  answer,
  questionAuthorId,
  currentUserId,
  currentUserRole,
  questionId,
  onAccepted,
}: {
  answer: FaqAnswerType
  questionAuthorId: string
  currentUserId: string
  currentUserRole: string
  questionId: string
  onAccepted: () => void
}) {
  const [loading, setLoading] = useState(false)
  const canAccept = currentUserId === questionAuthorId || currentUserRole === "ADMIN"

  async function handleAccept() {
    setLoading(true)
    const res = await fetch(`/api/faq/questions/${questionId}/answers/${answer.id}`, { method: "PATCH" })
    setLoading(false)
    if (!res.ok) { toast.error("Erreur lors de la validation."); return }
    onAccepted()
  }

  return (
    <div className={`rounded-xl border p-4 space-y-2.5 transition-colors ${
      answer.accepted
        ? "bg-primary/5 border-primary/25"
        : "bg-muted/30 border-border/60"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar user={answer.author} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-foreground truncate">{answer.author.name}</span>
              {answer.author.role === "ADMIN" && (
                <Badge variant="outline" className="text-[10px] text-primary border-primary/30 py-0">Administration</Badge>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {new Date(answer.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {answer.accepted && (
            <div className="flex items-center gap-1 text-primary text-xs font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Acceptée</span>
            </div>
          )}
          {canAccept && (
            <button
              onClick={handleAccept}
              disabled={loading}
              title={answer.accepted ? "Désélectionner" : "Marquer comme acceptée (+50 pts à l'auteur)"}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                answer.accepted
                  ? "text-primary hover:text-muted-foreground hover:bg-muted/60"
                  : "text-muted-foreground/40 hover:text-primary hover:bg-primary/10"
              }`}
            >
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{answer.body}</p>
    </div>
  )
}

// ── Question card ──────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  currentUserId,
  currentUserRole,
  onUpdate,
}: {
  question: FaqQuestionType
  currentUserId: string
  currentUserRole: string
  onUpdate: () => void
}) {
  const [open, setOpen] = useState(false)
  const [answerText, setAnswerText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleAnswer(e: React.FormEvent) {
    e.preventDefault()
    if (!answerText.trim()) return
    setSubmitting(true)

    const res = await fetch(`/api/faq/questions/${question.id}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: answerText.trim() }),
    })
    const data = await res.json()
    setSubmitting(false)

    if (!res.ok) { toast.error(data.error || "Erreur lors de l'envoi."); return }

    const isOwnQuestion = question.author.id === currentUserId
    if (!isOwnQuestion) toast.success("+25 pts gagnés pour votre réponse !")
    else toast.success("Réponse publiée.")

    setAnswerText("")
    onUpdate()
  }

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      question.resolved ? "border-primary/25 bg-card" : "border-border bg-card"
    }`}>
      {/* Question header */}
      <button
        className="w-full text-left flex items-start gap-3 p-4 md:p-5 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="mt-0.5 shrink-0">
          {question.resolved
            ? <CheckCircle2 className="w-5 h-5 text-primary" />
            : <CircleDot className="w-5 h-5 text-muted-foreground/50" />
          }
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-sm font-semibold text-foreground leading-snug">{question.title}</h3>
          {question.body && (
            <p className={`text-xs text-muted-foreground leading-relaxed line-clamp-2 ${open ? "hidden" : ""}`}>
              {question.body}
            </p>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Avatar user={question.author} size="sm" />
              <span className="text-xs text-muted-foreground">{question.author.name}</span>
              {question.author.role === "ADMIN" && (
                <Badge variant="outline" className="text-[10px] text-primary border-primary/30 py-0">Admin</Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground/50 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(question.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
            </span>
            <span className="text-xs text-muted-foreground/50 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {question.answers.length} réponse{question.answers.length !== 1 ? "s" : ""}
            </span>
            {question.resolved && (
              <Badge variant="outline" className="text-[10px] text-primary border-primary/30 py-0">Résolue</Badge>
            )}
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-5 space-y-4 border-t border-border/50 pt-4">
              {/* Full body */}
              {question.body && (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{question.body}</p>
              )}

              {/* Answers */}
              {question.answers.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {question.answers.length} réponse{question.answers.length !== 1 ? "s" : ""}
                  </p>
                  {question.answers.map((answer) => (
                    <AnswerCard
                      key={answer.id}
                      answer={answer}
                      questionId={question.id}
                      questionAuthorId={question.author.id}
                      currentUserId={currentUserId}
                      currentUserRole={currentUserRole}
                      onAccepted={onUpdate}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/50 italic">Aucune réponse pour l'instant. Soyez le premier !</p>
              )}

              {/* Answer form */}
              <form onSubmit={handleAnswer} className="flex gap-2 pt-1">
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Apportez votre réponse… (+25 pts)"
                  rows={2}
                  className="flex-1 rounded-xl border border-border bg-foreground/5 px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/40"
                />
                <Button
                  type="submit"
                  disabled={submitting || !answerText.trim()}
                  size="sm"
                  className="self-end gap-1.5 shrink-0"
                >
                  <SendHorizonal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Répondre</span>
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FaqPage() {
  const [questions, setQuestions] = useState<FaqQuestionType[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null)
  const [showAskForm, setShowAskForm] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newBody, setNewBody] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all")

  const load = useCallback(async () => {
    const [qRes, uRes] = await Promise.all([
      fetch("/api/faq/questions"),
      fetch("/api/profil"),
    ])
    if (qRes.ok) setQuestions(await qRes.json())
    if (uRes.ok) {
      const d = await uRes.json()
      setCurrentUser({ id: d.user.id, role: d.user.role })
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setSubmitting(true)

    const res = await fetch("/api/faq/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), body: newBody.trim() || undefined }),
    })
    const data = await res.json()
    setSubmitting(false)

    if (!res.ok) { toast.error(data.error || "Erreur lors de la publication."); return }

    toast.success("Question publiée !")
    setNewTitle("")
    setNewBody("")
    setShowAskForm(false)
    load()
  }

  const filtered = questions.filter((q) => {
    if (filter === "open") return !q.resolved
    if (filter === "resolved") return q.resolved
    return true
  })

  const openCount = questions.filter((q) => !q.resolved).length
  const resolvedCount = questions.filter((q) => q.resolved).length

  return (
    <div className="p-4 md:p-8 space-y-6">

      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <MessageCircleQuestion className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">FAQ Étudiante</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Posez vos questions, répondez à celles des autres et gagnez des points.
            </p>
          </div>
          <Button
            onClick={() => setShowAskForm((v) => !v)}
            size="sm"
            variant={showAskForm ? "outline" : "default"}
            className="gap-1.5 shrink-0"
          >
            {showAskForm ? <><X className="w-3.5 h-3.5" />Annuler</> : <><Plus className="w-3.5 h-3.5" />Poser une question</>}
          </Button>
        </div>
      </FadeIn>

      {/* Points info */}
      <FadeIn delay={0.03}>
        <div className="flex items-center gap-4 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 text-xs text-primary/80">
          <Sparkles className="w-4 h-4 shrink-0 text-primary" />
          <span>
            <span className="font-semibold">+25 pts</span> pour chaque réponse publiée ·{" "}
            <span className="font-semibold">+50 pts bonus</span> si votre réponse est acceptée par l'auteur de la question
          </span>
        </div>
      </FadeIn>

      {/* Ask form */}
      <AnimatePresence>
        {showAskForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <FadeIn>
              <form onSubmit={handleAsk} className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4">
                <h2 className="text-sm font-semibold text-foreground">Nouvelle question</h2>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground/70">Titre de la question <span className="text-destructive">*</span></label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Comment obtenir une attestation de scolarité ?"
                    maxLength={200}
                    required
                    className="w-full rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm focus:outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground/70">Détails (facultatif)</label>
                  <textarea
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    placeholder="Ajoutez du contexte si nécessaire…"
                    rows={3}
                    className="w-full rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/40"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowAskForm(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={submitting || !newTitle.trim()} size="sm" className="gap-1.5">
                    <SendHorizonal className="w-3.5 h-3.5" />
                    {submitting ? "Publication…" : "Publier"}
                  </Button>
                </div>
              </form>
            </FadeIn>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters + stats */}
      <FadeIn delay={0.05}>
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "open", "resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                filter === f
                  ? "bg-primary/10 text-primary border border-primary/25"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/80 border border-transparent"
              }`}
            >
              {f === "all" && `Toutes (${questions.length})`}
              {f === "open" && `En attente (${openCount})`}
              {f === "resolved" && `Résolues (${resolvedCount})`}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Questions list */}
      <FadeIn delay={0.08}>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <MessageCircleQuestion className="w-10 h-10 text-muted-foreground/30 mx-auto" />
            <p className="text-sm text-muted-foreground">
              {filter === "open" ? "Aucune question en attente." : filter === "resolved" ? "Aucune question résolue." : "Aucune question pour l'instant."}
            </p>
            {filter === "all" && (
              <Button size="sm" variant="outline" onClick={() => setShowAskForm(true)} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" />Poser la première question
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                currentUserId={currentUser?.id ?? ""}
                currentUserRole={currentUser?.role ?? "STUDENT"}
                onUpdate={load}
              />
            ))}
          </div>
        )}
      </FadeIn>
    </div>
  )
}
