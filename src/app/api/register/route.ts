import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

// Simple in-memory rate limiter (per IP, max 5 attempts per 15 minutes)
const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= MAX_ATTEMPTS) return false

  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"

  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: "Trop de tentatives. Réessayez dans 15 minutes." },
      { status: 429, headers: { "Retry-After": "900" } }
    )
  }

  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return Response.json({ error: "Tous les champs sont requis." }, { status: 400 })
  }

  if (password.length < 8) {
    return Response.json({ error: "Le mot de passe doit faire au moins 8 caractères." }, { status: 400 })
  }

  // Optional: domain restriction (set ALLOWED_EMAIL_DOMAINS env var as comma-separated list)
  const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS?.split(",").map((d) => d.trim()).filter(Boolean)
  if (allowedDomains && allowedDomains.length > 0) {
    const domain = email.split("@")[1]
    if (!domain || !allowedDomains.includes(domain)) {
      return Response.json(
        { error: "Seuls les emails universitaires sont acceptés." },
        { status: 400 }
      )
    }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return Response.json({ error: "Cet email est déjà utilisé." }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: { name, email, passwordHash, role: "STUDENT" },
  })

  return Response.json({ success: true }, { status: 201 })
}
