"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FadeIn } from "@/components/animations"
import Link from "next/link"

const categories = [
  { value: "SCOLARITE", label: "Scolarité" },
  { value: "LOGEMENT", label: "Logement" },
  { value: "INFORMATIQUE", label: "Informatique" },
  { value: "AUTRE", label: "Autre" },
]

export default function NewTicketPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("AUTRE")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category }),
    })

    if (res.ok) {
      const ticket = await res.json()
      router.push(`/dashboard/tickets/${ticket.id}`)
    } else {
      const data = await res.json()
      setError(data.error || "Une erreur est survenue.")
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <FadeIn className="mb-6">
        <Link href="/dashboard/tickets" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Retour aux tickets
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-foreground mt-2">Nouvelle demande</h1>
        <p className="text-sm text-muted-foreground">
          Décrivez votre problème, nous vous tiendrons informé à chaque étape.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations sur votre demande</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={category} onValueChange={(v) => { if (v) setCategory(v) }}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="title">Titre de la demande</Label>
              <Input
                id="title"
                placeholder="Résumez votre problème en une phrase"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description détaillée</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre situation, les démarches déjà effectuées, les documents que vous avez..."
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Envoi en cours..." : "Soumettre ma demande"}
              </Button>
              <Link href="/dashboard/tickets">
                <Button type="button" variant="ghost">
                  Annuler
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      </FadeIn>
    </div>
  )
}
