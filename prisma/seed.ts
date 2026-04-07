import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  // Nettoyage (ordre important à cause des FK)
  await prisma.motionVote.deleteMany()
  await prisma.parlementMotion.deleteMany()
  await prisma.parlementCandidature.deleteMany()
  await prisma.parlementSession.deleteMany()
  await prisma.projectVote.deleteMany()
  await prisma.budgetProject.deleteMany()
  await prisma.barometreResponse.deleteMany()
  await prisma.barometreSession.deleteMany()
  await prisma.userBadge.deleteMany()
  await prisma.pointTransaction.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.ticketHistory.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.user.deleteMany()

  // ── Badges ──────────────────────────────────────────────────────────────────
  await prisma.badge.createMany({
    data: [
      { slug: "FIRST_TICKET",    name: "Premier ticket",        description: "Soumis votre premier ticket",           icon: "🎫", points: 0 },
      { slug: "FIRST_VOTE",      name: "Premier vote",          description: "Voté pour un projet du campus",         icon: "🗳️", points: 0 },
      { slug: "FIRST_BAROMETRE", name: "Première réponse",      description: "Répondu au baromètre campus",           icon: "📊", points: 0 },
      { slug: "ENGAGED_STUDENT", name: "Étudiant engagé",       description: "Répondu à 3 baromètres ou plus",        icon: "⭐", points: 10 },
      { slug: "ELECTED_MP",      name: "Député·e élu·e",        description: "Tiré·e au sort au Parlement Éphémère",  icon: "🏛️", points: 25 },
      { slug: "MOTION_CREATOR",  name: "Porteur de motion",     description: "Déposé une motion au parlement",        icon: "📜", points: 15 },
      { slug: "ACTIVE_CITIZEN",  name: "Citoyen actif",         description: "Voté sur 5 motions ou plus",            icon: "🌟", points: 20 },
    ],
  })

  // ── Utilisateurs ─────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: "Admin Agora360",
      email: "admin@agora360.fr",
      passwordHash: await bcrypt.hash("password123", 12),
      role: "ADMIN",
    },
  })

  const [alice, bob, chloé] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alice Martin",
        email: "alice.martin@univ.fr",
        passwordHash: await bcrypt.hash("password123", 12),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Dupont",
        email: "bob.dupont@univ.fr",
        passwordHash: await bcrypt.hash("password123", 12),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: {
        name: "Chloé Bernard",
        email: "chloe.bernard@univ.fr",
        passwordHash: await bcrypt.hash("password123", 12),
        role: "STUDENT",
      },
    }),
  ])

  // ── Tickets ──────────────────────────────────────────────────────────────────
  const t1 = await prisma.ticket.create({
    data: {
      title: "Problème d'inscription au cours de droit constitutionnel",
      description: "Je n'arrive pas à m'inscrire au TD de droit constitutionnel malgré plusieurs tentatives sur l'ENT.",
      category: "SCOLARITE",
      status: "RESOLVED",
      authorId: alice.id,
      assignedToId: admin.id,
    },
  })
  await prisma.ticketHistory.createMany({
    data: [
      { ticketId: t1.id, status: "OPEN",        comment: "Ticket soumis",                                             changedById: alice.id, createdAt: new Date("2026-03-10T09:00:00") },
      { ticketId: t1.id, status: "IN_PROGRESS", comment: "Nous analysons le problème avec le service informatique.", changedById: admin.id,  createdAt: new Date("2026-03-11T10:30:00") },
      { ticketId: t1.id, status: "RESOLVED",    comment: "L'inscription a été effectuée manuellement.",              changedById: admin.id,  createdAt: new Date("2026-03-12T14:00:00") },
    ],
  })

  const t2 = await prisma.ticket.create({
    data: {
      title: "Bourse CROUS non reçue pour le mois de mars",
      description: "Je n'ai pas reçu ma bourse pour le mois de mars.",
      category: "LOGEMENT",
      status: "IN_PROGRESS",
      authorId: bob.id,
      assignedToId: admin.id,
    },
  })
  await prisma.ticketHistory.createMany({
    data: [
      { ticketId: t2.id, status: "OPEN",        comment: "Ticket soumis",                                                            changedById: bob.id,  createdAt: new Date("2026-03-20T08:15:00") },
      { ticketId: t2.id, status: "IN_PROGRESS", comment: "Dossier transmis au service des bourses. Retour attendu sous 5 jours.", changedById: admin.id, createdAt: new Date("2026-03-21T11:00:00") },
    ],
  })

  const t3 = await prisma.ticket.create({
    data: {
      title: "Accès refusé à la bibliothèque universitaire",
      description: "Ma carte étudiante ne fonctionne plus pour accéder à la BU.",
      category: "INFORMATIQUE",
      status: "OPEN",
      authorId: chloé.id,
    },
  })
  await prisma.ticketHistory.createMany({ data: [{ ticketId: t3.id, status: "OPEN", comment: "Ticket soumis", changedById: chloé.id, createdAt: new Date("2026-03-28T07:45:00") }] })

  const t4 = await prisma.ticket.create({
    data: {
      title: "Certificat de scolarité introuvable dans l'ENT",
      description: "Je dois fournir un certificat de scolarité pour mon dossier de stage.",
      category: "SCOLARITE",
      status: "CLOSED",
      authorId: alice.id,
    },
  })
  await prisma.ticketHistory.createMany({
    data: [
      { ticketId: t4.id, status: "OPEN",     comment: "Ticket soumis",                                                  changedById: alice.id, createdAt: new Date("2026-03-01T10:00:00") },
      { ticketId: t4.id, status: "RESOLVED", comment: "Disponible dans Documents > Attestations dans votre ENT.",       changedById: admin.id, createdAt: new Date("2026-03-01T14:00:00") },
      { ticketId: t4.id, status: "CLOSED",   comment: "Ticket fermé après confirmation.",                               changedById: admin.id, createdAt: new Date("2026-03-03T09:00:00") },
    ],
  })

  const t5 = await prisma.ticket.create({
    data: {
      title: "Salle de TD incorrecte dans l'emploi du temps",
      description: "Mon emploi du temps indique la salle B204 mais elle est occupée par un autre groupe.",
      category: "AUTRE",
      status: "OPEN",
      authorId: bob.id,
    },
  })
  await prisma.ticketHistory.createMany({ data: [{ ticketId: t5.id, status: "OPEN", comment: "Ticket soumis", changedById: bob.id, createdAt: new Date("2026-03-29T12:00:00") }] })

  // ── Baromètre ─────────────────────────────────────────────────────────────────
  const barSession = await prisma.barometreSession.create({
    data: { weekLabel: "Semaine du 31 mars 2026", status: "OPEN" },
  })
  await prisma.barometreResponse.createMany({
    data: [
      { sessionId: barSession.id, userId: alice.id, moodScore: 4, wellbeing: 3, comment: "La semaine a été chargée mais le campus est agréable." },
      { sessionId: barSession.id, userId: bob.id,   moodScore: 2, wellbeing: 2, comment: "Beaucoup de pression avec les examens qui approchent." },
    ],
  })

  // ── Budget Participatif ───────────────────────────────────────────────────────
  const proj1 = await prisma.budgetProject.create({
    data: {
      title: "Rénovation de la salle de sport",
      description: "Remplacement des équipements vétustes de la salle de sport du campus A. Nouveaux appareils cardio, vestiaires rénovés et meilleur éclairage.",
      amount: 18000,
      category: "SPORT",
      status: "ACTIVE",
      createdById: admin.id,
    },
  })
  await prisma.projectVote.createMany({
    data: [
      { projectId: proj1.id, userId: alice.id, vote: "FOR" },
      { projectId: proj1.id, userId: bob.id,   vote: "FOR" },
    ],
  })

  const proj2 = await prisma.budgetProject.create({
    data: {
      title: "Création d'un fab lab étudiant",
      description: "Espace de fabrication numérique avec imprimantes 3D, découpeuse laser et matériel Arduino pour les projets étudiants.",
      amount: 25000,
      category: "NUMERIQUE",
      status: "PROPOSED",
      createdById: admin.id,
    },
  })
  void proj2

  await prisma.budgetProject.create({
    data: {
      title: "Festival culturel de printemps",
      description: "Organisation d'un festival inter-facultés : concerts, expositions et conférences sur 3 jours.",
      amount: 8000,
      category: "CULTURE",
      status: "FUNDED",
      createdById: admin.id,
    },
  })

  // ── Parlement Éphémère ────────────────────────────────────────────────────────
  const parlSession = await prisma.parlementSession.create({
    data: { monthLabel: "Avril 2026", maxSeats: 3, status: "CANDIDATURES" },
  })
  await prisma.parlementCandidature.createMany({
    data: [
      { sessionId: parlSession.id, userId: alice.id, motivation: "Je veux améliorer l'accès aux ressources numériques pour tous les étudiants." },
      { sessionId: parlSession.id, userId: bob.id,   motivation: "Je souhaite porter la question du logement étudiant et des bourses." },
    ],
  })

  // Points de démonstration pour Alice
  await prisma.pointTransaction.createMany({
    data: [
      { userId: alice.id, action: "TICKET_SUBMITTED",    points: 10, label: "Ticket soumis",            createdAt: new Date("2026-03-10T09:00:00") },
      { userId: alice.id, action: "TICKET_SUBMITTED",    points: 10, label: "Ticket soumis",            createdAt: new Date("2026-03-01T10:00:00") },
      { userId: alice.id, action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse au baromètre",     createdAt: new Date("2026-04-01T09:00:00") },
      { userId: alice.id, action: "BUDGET_VOTED",        points: 10, label: "Vote sur un projet",       createdAt: new Date("2026-04-01T10:00:00") },
      { userId: alice.id, action: "PARLEMENT_APPLIED",   points: 15, label: "Candidature au parlement", createdAt: new Date("2026-04-02T08:00:00") },
    ],
  })

  // Badges Alice
  const firstTicketBadge = await prisma.badge.findUnique({ where: { slug: "FIRST_TICKET" } })
  const firstBaroméètreBadge = await prisma.badge.findUnique({ where: { slug: "FIRST_BAROMETRE" } })
  const firstVoteBadge = await prisma.badge.findUnique({ where: { slug: "FIRST_VOTE" } })

  if (firstTicketBadge && firstBaroméètreBadge && firstVoteBadge) {
    await prisma.userBadge.createMany({
      data: [
        { userId: alice.id, badgeId: firstTicketBadge.id },
        { userId: alice.id, badgeId: firstBaroméètreBadge.id },
        { userId: alice.id, badgeId: firstVoteBadge.id },
      ],
    })
  }

  console.log(`✅ Seed terminé :`)
  console.log(`   👤 Admin    : admin@agora360.fr / password123`)
  console.log(`   👤 Étudiant : alice.martin@univ.fr / password123`)
  console.log(`   👤 Étudiant : bob.dupont@univ.fr / password123`)
  console.log(`   👤 Étudiant : chloe.bernard@univ.fr / password123`)
  console.log(`   🎫 ${[t1, t2, t3, t4, t5].length} tickets créés`)
  console.log(`   📊 1 session baromètre ouverte`)
  console.log(`   💰 3 projets budget participatif`)
  console.log(`   🏛️ 1 session parlement en candidatures`)
  console.log(`   🏅 7 badges définis`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
