# Agora360 – student participation platform

A web platform where students take part in the life of their school: they vote, propose projects, give feedback and ask questions, while administrators manage sessions and moderate content. The interface is in French.

Built individually, with AI-assisted development (Claude Code).

## Features

- **Participatory budget**: students vote for or against proposed projects, with a live vote bar
- **Student parliament**: sessions, candidacies, motions with votes, and a random draw of members
- **Mood barometer**: short sessions where students rate how they feel
- **Tickets**: students report issues and follow their status history
- **FAQ**: questions and answers
- **Gamification**: points, levels, badges and a rewards shop
- **Dashboard** with statistics, dark and light themes
- **Admin space** to create and manage sessions

## Security

- Passwords hashed with **bcrypt** (cost factor 12); the current password is checked before any change
- **Role-based access control** (student / admin) checked on the server in every protected API route
- **Rate limiting** on sign-up: 5 attempts per IP address every 15 minutes
- Optional restriction of sign-ups to allowed email domains (`ALLOWED_EMAIL_DOMAINS`)
- **HTTP security headers**: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- Sessions expire after 8 hours (NextAuth)

Known limit: the rate limiter is kept in the server's memory, so it resets when the server restarts and is not shared between instances. A shared store such as Redis would fix this in production.

## Tech stack

- **Next.js** (App Router), React, TypeScript
- **PostgreSQL** with **Prisma** (ORM)
- **NextAuth.js** (Auth.js v5) with the Prisma adapter
- TanStack Query, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, Sonner

## Getting started

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file (never commit it) with at least the database URL and the NextAuth settings:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/agora360
   AUTH_SECRET=a_long_random_string
   ```

3. Push the schema to the database, optionally seed it, and start the server:

   ```bash
   npm run db:push
   npm run db:seed
   npm run dev
   ```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```text
prisma/schema.prisma          data model (users, tickets, barometer, budget, parliament, points, badges, FAQ)
src/app/                      pages: landing, login, register, dashboard/*
src/app/api/                  API routes (auth, register, profile, tickets, barometer, budget, parliament, FAQ)
src/components/               UI components per feature
src/lib/auth.ts               NextAuth configuration
next.config.ts                security headers
```
