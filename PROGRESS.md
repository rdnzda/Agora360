# Agora360 — UI/UX Redesign Progress

## Date : 2026-04-05 — TERMINÉ ✅

## Packages installés
- `sonner` — toasts animés
- `next-themes` — toggle dark/light mode

## Fichiers modifiés

### Design System
- [x] `src/app/globals.css` — nouveau palette OKLCH indigo/teal, radius 0.75rem, utilities glassmorphism/gradient/animations
- [x] `src/app/layout.tsx` — ThemeProvider (next-themes) + Toaster (sonner) + viewport themeColor

### Landing Page (Homepage)
- [x] `src/app/page.tsx` — Remplacement complet du template Next.js par une landing page premium (Hero, Stats, Bento Grid features, How it works, Testimonials, CTA, Footer)
- [x] `src/components/landing-navbar.tsx` — NEW : Navbar sticky glassmorphism avec logo gradient et dark mode toggle

### Dashboard
- [x] `src/components/sidebar.tsx` — Sidebar sombre indigo, logo gradient, active state gradient teal, avatar gradient, dark mode toggle, indicateur actif animé
- [x] `src/components/dashboard-shell.tsx` — Mobile top bar sombre, dark mode toggle, bg-sidebar
- [x] `src/components/animations.tsx` — Nouveaux composants : ScrollReveal, ScaleIn, CountUp, HoverCard, StaggerGrid, StaggerGridItem
- [x] `src/components/dashboard/stat-card.tsx` — Gradient, CountUp animé, HoverCard, variantes par feature (primary/teal/amber/violet)
- [x] `src/app/dashboard/page.tsx` — Welcome header gradient, variantes stat cards, section headers avec accent bar

### Gamification
- [x] `src/components/profil/level-indicator.tsx` — Progress bar gradient animée (indigo→teal→amber), glow cap, CountUp points, icône trophy
- [x] `src/components/profil/badge-card.tsx` — Badges premium (container gradient, ScaleIn staggeré, locked = saturate-0)

### Features
- [x] `src/components/budget/vote-bar.tsx` — Barre h-3, gradient vert/rouge, animation width on mount, pourcentages
- [x] `src/components/barometre/mood-scale.tsx` — Boutons 16x16, whileTap, layoutId indicator, labels texte
- [x] `src/components/budget/vote-buttons.tsx` — Toasts sonner success/error
- [x] `src/components/parlement/motion-vote-buttons.tsx` — Toasts sonner
- [x] `src/components/parlement/draw-trigger-button.tsx` — Toasts sonner

### Auth Pages
- [x] `src/app/login/page.tsx` — btn-gradient submit, glass testimonials, rich overlay, branding badge, toast error via sonner, suppression setError inline
- [x] `src/app/register\page.tsx` — Idem login + toast success inscription

### Sécurité
- [x] `next.config.ts` — Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- [x] `src/lib/auth.ts` — Session maxAge 8h
- [x] `src/app/api/register/route.ts` — Rate limiting (5 req/15min par IP) + validation domaine email optionnelle (env ALLOWED_EMAIL_DOMAINS)

## Build
- `npm run build` → ✅ 0 erreurs, 0 warnings TypeScript
