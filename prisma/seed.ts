import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database (présentation CreaCampus)…")

  // ── Nettoyage (ordre FK) ───────────────────────────────────────────────────
  await prisma.motionVote.deleteMany()
  await prisma.parlementMotion.deleteMany()
  await prisma.parlementCandidature.deleteMany()
  await prisma.parlementSession.deleteMany()
  await prisma.projectVote.deleteMany()
  await prisma.budgetProject.deleteMany()
  await prisma.barometreResponse.deleteMany()
  await prisma.barometreSession.deleteMany()
  await prisma.faqAnswer.deleteMany()
  await prisma.faqQuestion.deleteMany()
  await prisma.userBadge.deleteMany()
  await prisma.pointTransaction.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.ticketHistory.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // ── Badges ─────────────────────────────────────────────────────────────────
  await prisma.badge.createMany({
    data: [
      { slug: "FIRST_TICKET",    name: "Premier ticket",    description: "Soumis votre premier ticket administratif",     icon: "🎫", points: 0  },
      { slug: "FIRST_VOTE",      name: "Premier vote",      description: "Voté pour un projet du campus",                 icon: "🗳️", points: 0  },
      { slug: "FIRST_BAROMETRE", name: "Première réponse",  description: "Répondu au baromètre campus pour la 1ère fois", icon: "📊", points: 0  },
      { slug: "ENGAGED_STUDENT", name: "Étudiant engagé",   description: "Répondu à 3 baromètres ou plus",                icon: "⭐", points: 10 },
      { slug: "ELECTED_MP",      name: "Député·e élu·e",    description: "Tiré·e au sort au Parlement Éphémère",          icon: "🏛️", points: 25 },
      { slug: "MOTION_CREATOR",  name: "Porteur de motion", description: "Déposé une motion au parlement",                icon: "📜", points: 15 },
      { slug: "ACTIVE_CITIZEN",  name: "Citoyen actif",     description: "Voté sur 5 motions ou plus",                    icon: "🌟", points: 20 },
    ],
  })

  const badges = await prisma.badge.findMany()
  const badge = (slug: string) => badges.find(b => b.slug === slug)!

  // ── Mot de passe commun ────────────────────────────────────────────────────
  const hash = await bcrypt.hash("password123", 12)

  // ── Utilisateurs ──────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: { name: "Admin Agora360", email: "admin@agora360.fr", passwordHash: hash, role: "ADMIN", image: "https://randomuser.me/api/portraits/men/75.jpg" },
  })

  const [
    alice, bob, chloé, dylan, emma,
    farid, jade, kevin, léa, mathieu, nora,
  ] = await Promise.all([
    prisma.user.create({ data: { name: "Alice Martin",    email: "alice.martin@univ.fr",    passwordHash: hash, role: "STUDENT", image: "https://randomuser.me/api/portraits/women/44.jpg" } }),
    prisma.user.create({ data: { name: "Bob Dupont",      email: "bob.dupont@univ.fr",      passwordHash: hash, role: "STUDENT", image: "https://randomuser.me/api/portraits/men/32.jpg"   } }),
    prisma.user.create({ data: { name: "Chloé Bernard",   email: "chloe.bernard@univ.fr",   passwordHash: hash, role: "STUDENT", image: "https://randomuser.me/api/portraits/women/68.jpg" } }),
    prisma.user.create({ data: { name: "Dylan Moreau",    email: "dylan.moreau@univ.fr",    passwordHash: hash, role: "STUDENT", image: "https://randomuser.me/api/portraits/men/52.jpg"   } }),
    prisma.user.create({ data: { name: "Emma Leroy",      email: "emma.leroy@univ.fr",      passwordHash: hash, role: "STUDENT", image: "https://randomuser.me/api/portraits/women/21.jpg" } }),
    prisma.user.create({ data: { name: "Farid Benali",    email: "farid.benali@univ.fr",    passwordHash: hash, role: "STUDENT", image: "https://randomuser.me/api/portraits/men/15.jpg"   } }),
    prisma.user.create({ data: { name: "Jade Simon",      email: "jade.simon@univ.fr",      passwordHash: hash, role: "STUDENT", image: "https://randomuser.me/api/portraits/women/33.jpg" } }),
    prisma.user.create({ data: { name: "Kevin Rousseau",  email: "kevin.rousseau@univ.fr",  passwordHash: hash, role: "STUDENT", image: "https://randomuser.me/api/portraits/men/41.jpg"   } }),
    prisma.user.create({ data: { name: "Léa Fontaine",    email: "lea.fontaine@univ.fr",    passwordHash: hash, role: "STUDENT", image: "https://randomuser.me/api/portraits/women/57.jpg" } }),
    prisma.user.create({ data: { name: "Mathieu Garnier", email: "mathieu.garnier@univ.fr", passwordHash: hash, role: "STUDENT", image: "https://randomuser.me/api/portraits/men/29.jpg"   } }),
    prisma.user.create({ data: { name: "Nora Hamidi",     email: "nora.hamidi@univ.fr",     passwordHash: hash, role: "STUDENT", image: "https://randomuser.me/api/portraits/women/90.jpg" } }),
  ])

  const students = [alice, bob, chloé, dylan, emma, farid, jade, kevin, léa, mathieu, nora]

  // ── Tickets (22 tickets réalistes) ────────────────────────────────────────
  type TicketInput = {
    title: string; description: string
    category: "SCOLARITE"|"LOGEMENT"|"INFORMATIQUE"|"AUTRE"
    status: "OPEN"|"IN_PROGRESS"|"RESOLVED"|"CLOSED"
    authorId: string; assignedToId?: string
    history: { status: "OPEN"|"IN_PROGRESS"|"RESOLVED"|"CLOSED"; comment: string; changedById: string; createdAt: Date }[]
  }

  const d = (iso: string) => new Date(iso)

  const ticketDefs: TicketInput[] = [
    {
      title: "Inscription au TD de droit constitutionnel bloquée",
      description: "Impossible de m'inscrire via l'ENT depuis 3 jours. Le bouton d'inscription reste grisé malgré plusieurs tentatives.",
      category: "SCOLARITE", status: "RESOLVED",
      authorId: alice.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis.",                                                changedById: alice.id, createdAt: d("2026-01-15T09:00:00") },
        { status: "IN_PROGRESS", comment: "Problème identifié côté ENT. Transmission au service info.",   changedById: admin.id, createdAt: d("2026-01-16T10:30:00") },
        { status: "RESOLVED",    comment: "Inscription effectuée manuellement. Le bug ENT est corrigé.",  changedById: admin.id, createdAt: d("2026-01-17T14:00:00") },
      ],
    },
    {
      title: "Bourse CROUS non versée — février 2026",
      description: "Je n'ai pas reçu ma bourse du mois de février. Mon dossier est à jour et validé depuis octobre.",
      category: "LOGEMENT", status: "RESOLVED",
      authorId: bob.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis.",                                                          changedById: bob.id,   createdAt: d("2026-02-05T08:15:00") },
        { status: "IN_PROGRESS", comment: "Dossier transmis au service des bourses. Retour attendu sous 5 jours.",  changedById: admin.id, createdAt: d("2026-02-06T11:00:00") },
        { status: "RESOLVED",    comment: "Virement de régularisation effectué. Visible sur votre compte sous 48h.",changedById: admin.id, createdAt: d("2026-02-10T15:30:00") },
      ],
    },
    {
      title: "Carte étudiante désactivée — accès BU impossible",
      description: "Ma carte ne fonctionne plus pour entrer à la bibliothèque universitaire depuis ce matin.",
      category: "INFORMATIQUE", status: "RESOLVED",
      authorId: chloé.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis.",                                                    changedById: chloé.id, createdAt: d("2026-01-28T07:45:00") },
        { status: "IN_PROGRESS", comment: "Badge recréé dans le système. Test à effectuer à l'entrée BU.",    changedById: admin.id, createdAt: d("2026-01-28T11:00:00") },
        { status: "RESOLVED",    comment: "Confirmé fonctionnel par l'étudiant.",                             changedById: chloé.id, createdAt: d("2026-01-28T14:00:00") },
      ],
    },
    {
      title: "Certificat de scolarité absent de l'ENT",
      description: "J'ai besoin d'un certificat de scolarité pour mon dossier de stage mais il n'apparaît pas dans l'espace documentaire.",
      category: "SCOLARITE", status: "CLOSED",
      authorId: alice.id,
      history: [
        { status: "OPEN",     comment: "Ticket soumis.",                                                           changedById: alice.id, createdAt: d("2026-01-10T10:00:00") },
        { status: "RESOLVED", comment: "Disponible dans Documents > Attestations > Scolarité sur votre ENT.",     changedById: admin.id, createdAt: d("2026-01-10T14:00:00") },
        { status: "CLOSED",   comment: "Fermé après confirmation par l'étudiante.",                               changedById: admin.id, createdAt: d("2026-01-12T09:00:00") },
      ],
    },
    {
      title: "Salle de TD incorrecte dans l'emploi du temps",
      description: "Mon EDT indique salle B204 mais le groupe B2 occupe déjà cette salle le mardi matin.",
      category: "AUTRE", status: "RESOLVED",
      authorId: dylan.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis.",                                                         changedById: dylan.id, createdAt: d("2026-02-03T12:00:00") },
        { status: "IN_PROGRESS", comment: "Vérification auprès du responsable des salles.",                        changedById: admin.id, createdAt: d("2026-02-04T09:00:00") },
        { status: "RESOLVED",    comment: "Salle déplacée en A110. EDT mis à jour dans l'ENT.",                    changedById: admin.id, createdAt: d("2026-02-04T16:00:00") },
      ],
    },
    {
      title: "Accès VPN campus indisponible hors campus",
      description: "Impossible de me connecter au VPN universitaire depuis mon domicile. L'erreur 'timeout' s'affiche.",
      category: "INFORMATIQUE", status: "RESOLVED",
      authorId: emma.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis.",                                                              changedById: emma.id, createdAt: d("2026-02-12T18:00:00") },
        { status: "IN_PROGRESS", comment: "Incident réseau signalé. Maintenance en cours.",                              changedById: admin.id, createdAt: d("2026-02-13T09:00:00") },
        { status: "RESOLVED",    comment: "VPN rétabli. Mettez à jour le client FortiClient vers la v7.2.",             changedById: admin.id, createdAt: d("2026-02-14T11:00:00") },
      ],
    },
    {
      title: "Convention de stage non signée après 3 semaines",
      description: "Ma convention envoyée il y a 3 semaines n'a toujours pas été signée par l'administration. Mon entreprise attend.",
      category: "SCOLARITE", status: "RESOLVED",
      authorId: farid.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis.",                                                                         changedById: farid.id, createdAt: d("2026-02-20T14:00:00") },
        { status: "IN_PROGRESS", comment: "Convention retrouvée dans la file d'attente. Signature prioritaire ce soir.",           changedById: admin.id, createdAt: d("2026-02-21T10:00:00") },
        { status: "RESOLVED",    comment: "Convention signée et renvoyée par email. Délai exceptionnel dû à un fort volume.",     changedById: admin.id, createdAt: d("2026-02-21T17:30:00") },
      ],
    },
    {
      title: "Logiciel SPSS indisponible en salle informatique",
      description: "SPSS ne se lance plus en salle 302. Nos TP de statistiques sont bloqués.",
      category: "INFORMATIQUE", status: "CLOSED",
      authorId: jade.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis.",                                                     changedById: jade.id,  createdAt: d("2026-03-01T13:00:00") },
        { status: "IN_PROGRESS", comment: "Licence expirée. Renouvellement en cours.",                         changedById: admin.id, createdAt: d("2026-03-02T09:30:00") },
        { status: "RESOLVED",    comment: "Licence renouvelée, SPSS fonctionnel sur les 30 postes.",           changedById: admin.id, createdAt: d("2026-03-03T14:00:00") },
        { status: "CLOSED",      comment: "Confirmé par le responsable de TP.",                                changedById: admin.id, createdAt: d("2026-03-04T09:00:00") },
      ],
    },
    {
      title: "Remboursement frais de déplacement non reçu",
      description: "J'ai participé à une conférence représentant l'université le 15 janvier. Les frais de transport ne m'ont pas été remboursés.",
      category: "SCOLARITE", status: "RESOLVED",
      authorId: kevin.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis avec justificatifs.",                                      changedById: kevin.id, createdAt: d("2026-02-01T11:00:00") },
        { status: "IN_PROGRESS", comment: "Dossier transmis à la comptabilité. Traitement sous 10 jours.",         changedById: admin.id, createdAt: d("2026-02-03T14:00:00") },
        { status: "RESOLVED",    comment: "Virement de 47,50 € effectué. Récapitulatif envoyé par email.",         changedById: admin.id, createdAt: d("2026-02-12T16:00:00") },
      ],
    },
    {
      title: "Chauffage en panne en salle de cours A112",
      description: "La salle A112 n'est plus chauffée depuis lundi. La température est inférieure à 15°C. Cours difficiles à suivre.",
      category: "AUTRE", status: "RESOLVED",
      authorId: léa.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis.",                                                           changedById: léa.id,   createdAt: d("2026-01-22T08:00:00") },
        { status: "IN_PROGRESS", comment: "Technicien de maintenance mandaté. Intervention prévue demain matin.",    changedById: admin.id, createdAt: d("2026-01-22T10:00:00") },
        { status: "RESOLVED",    comment: "Vanne thermostatique remplacée. Chauffage opérationnel.",                 changedById: admin.id, createdAt: d("2026-01-23T14:30:00") },
      ],
    },
    {
      title: "Attestation de réussite introuvable après diplômation",
      description: "J'ai obtenu ma licence en juillet. Mon attestation de réussite n'est pas accessible dans l'ENT pour postuler en master.",
      category: "SCOLARITE", status: "RESOLVED",
      authorId: mathieu.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis.",                                              changedById: mathieu.id, createdAt: d("2026-01-05T09:00:00") },
        { status: "IN_PROGRESS", comment: "Vérification du dossier de diplomation en cours.",           changedById: admin.id,   createdAt: d("2026-01-06T10:00:00") },
        { status: "RESOLVED",    comment: "Attestation générée et disponible dans l'ENT + email.",      changedById: admin.id,   createdAt: d("2026-01-07T11:00:00") },
      ],
    },
    {
      title: "Résidence universitaire — problème de plomberie",
      description: "Fuite d'eau sous le lavabo en chambre 214, bâtiment C. Le sol est mouillé depuis deux jours.",
      category: "LOGEMENT", status: "RESOLVED",
      authorId: nora.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis avec photo jointe.",                                  changedById: nora.id,  createdAt: d("2026-02-18T07:30:00") },
        { status: "IN_PROGRESS", comment: "Plombier dépêché. Intervention prévue dans l'après-midi.",         changedById: admin.id, createdAt: d("2026-02-18T09:00:00") },
        { status: "RESOLVED",    comment: "Joint du siphon remplacé. Sèche-serviette mis à disposition.",     changedById: admin.id, createdAt: d("2026-02-18T15:00:00") },
      ],
    },
    {
      title: "Mot de passe ENT impossible à réinitialiser",
      description: "Le lien de réinitialisation n'arrive pas sur mon email universitaire depuis 48h. J'ai essayé 5 fois.",
      category: "INFORMATIQUE", status: "RESOLVED",
      authorId: alice.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis.",                                                               changedById: alice.id, createdAt: d("2026-03-04T16:00:00") },
        { status: "IN_PROGRESS", comment: "Adresse email secondaire bloquée. Réinitialisation manuelle initiée.",        changedById: admin.id, createdAt: d("2026-03-05T09:30:00") },
        { status: "RESOLVED",    comment: "Nouveau mot de passe temporaire envoyé par email pro. À changer à connexion.",changedById: admin.id, createdAt: d("2026-03-05T11:00:00") },
      ],
    },
    {
      title: "Absence d'enseignant non renseignée dans l'ENT",
      description: "Notre professeur de macroéconomie est absent depuis 2 semaines sans qu'aucun remplacement ne soit annoncé.",
      category: "SCOLARITE", status: "RESOLVED",
      authorId: emma.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis au nom du groupe TD4.",                                        changedById: emma.id,  createdAt: d("2026-03-08T12:00:00") },
        { status: "IN_PROGRESS", comment: "Arrêt maladie en cours. Chargé de cours recruté en urgence.",               changedById: admin.id, createdAt: d("2026-03-09T14:00:00") },
        { status: "RESOLVED",    comment: "2 séances de rattrapage planifiées. Calendrier envoyé par mail.",            changedById: admin.id, createdAt: d("2026-03-10T10:00:00") },
      ],
    },
    {
      title: "Impression carte étudiante impossible — distributeur en panne",
      description: "Le distributeur de cartes à l'accueil principal est hors service depuis le 25 mars. J'en ai besoin pour mon examen.",
      category: "INFORMATIQUE", status: "IN_PROGRESS",
      authorId: farid.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis.",                                                             changedById: farid.id, createdAt: d("2026-03-26T10:00:00") },
        { status: "IN_PROGRESS", comment: "Technicien mandaté. Pièce commandée, livraison 5–7 jours ouvrés.",         changedById: admin.id, createdAt: d("2026-03-27T09:00:00") },
      ],
    },
    {
      title: "Note manquante sur le relevé semestriel",
      description: "Ma note de droit du travail (18/20) n'apparaît pas sur mon relevé de notes S3 disponible sur l'ENT.",
      category: "SCOLARITE", status: "IN_PROGRESS",
      authorId: jade.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis avec capture d'écran du relevé.",                             changedById: jade.id,  createdAt: d("2026-04-02T09:00:00") },
        { status: "IN_PROGRESS", comment: "Vérification en cours auprès du jury. Délai estimé 3 jours ouvrés.",       changedById: admin.id, createdAt: d("2026-04-02T14:00:00") },
      ],
    },
    {
      title: "Wi-Fi coupé en résidence étudiante bâtiment D",
      description: "Le Wi-Fi du bâtiment D de la résidence universitaire est coupé depuis dimanche soir. Aucune communication officielle.",
      category: "INFORMATIQUE", status: "IN_PROGRESS",
      authorId: dylan.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis. Problème confirmé par 8 résidents.",                         changedById: dylan.id, createdAt: d("2026-04-07T08:00:00") },
        { status: "IN_PROGRESS", comment: "Incident réseau signalé au prestataire. Intervention planifiée mercredi.", changedById: admin.id, createdAt: d("2026-04-07T10:30:00") },
      ],
    },
    {
      title: "Couloir du bâtiment B mal éclairé — problème de sécurité",
      description: "Le couloir B2 est plongé dans l'obscurité en soirée. Plusieurs néons grillés depuis 3 semaines.",
      category: "AUTRE", status: "OPEN",
      authorId: léa.id,
      history: [
        { status: "OPEN", comment: "Ticket soumis.", changedById: léa.id, createdAt: d("2026-04-09T17:00:00") },
      ],
    },
    {
      title: "Accès plateforme Moodle bloqué après changement de promotion",
      description: "Depuis mon passage en M2, je n'ai plus accès aux cours de M1 dont j'ai besoin pour mon mémoire.",
      category: "INFORMATIQUE", status: "OPEN",
      authorId: kevin.id,
      history: [
        { status: "OPEN", comment: "Ticket soumis.", changedById: kevin.id, createdAt: d("2026-04-10T11:00:00") },
      ],
    },
    {
      title: "Demande de dérogation inscription en double-licence refusée sans motif",
      description: "J'ai reçu un refus de dérogation par email sans aucune explication. Je voudrais comprendre les critères de sélection.",
      category: "SCOLARITE", status: "OPEN",
      authorId: nora.id,
      history: [
        { status: "OPEN", comment: "Ticket soumis avec copie du refus en PJ.", changedById: nora.id, createdAt: d("2026-04-11T14:00:00") },
      ],
    },
    {
      title: "Absences injustifiées erronées sur le bulletin",
      description: "3 absences injustifiées me sont attribuées alors que j'avais des certificats médicaux transmis à la scolarité.",
      category: "SCOLARITE", status: "OPEN",
      authorId: mathieu.id,
      history: [
        { status: "OPEN", comment: "Ticket soumis avec les copies de mes certificats.", changedById: mathieu.id, createdAt: d("2026-04-12T10:30:00") },
      ],
    },
    {
      title: "Espace de coworking fermé sans préavis",
      description: "L'espace de coworking du bâtiment A est fermé depuis lundi alors qu'aucune annonce n'a été faite. Des examens blancs y sont prévus.",
      category: "AUTRE", status: "IN_PROGRESS",
      authorId: bob.id, assignedToId: admin.id,
      history: [
        { status: "OPEN",        comment: "Ticket soumis au nom de l'asso BDE.",                                changedById: bob.id,   createdAt: d("2026-04-05T09:00:00") },
        { status: "IN_PROGRESS", comment: "Travaux d'urgence (mise aux normes électrique). Fin prévue le 16.", changedById: admin.id, createdAt: d("2026-04-05T14:00:00") },
      ],
    },
  ]

  for (const def of ticketDefs) {
    const ticket = await prisma.ticket.create({
      data: {
        title: def.title,
        description: def.description,
        category: def.category,
        status: def.status,
        authorId: def.authorId,
        assignedToId: def.assignedToId,
        createdAt: def.history[0].createdAt,
      },
    })
    await prisma.ticketHistory.createMany({
      data: def.history.map(h => ({ ...h, ticketId: ticket.id })),
    })
  }

  // ── Baromètre (6 semaines) ─────────────────────────────────────────────────
  const barSessions = await Promise.all([
    prisma.barometreSession.create({ data: { weekLabel: "Semaine du 6 janvier 2026",   status: "CLOSED", closedAt: d("2026-01-12T23:59:00") } }),
    prisma.barometreSession.create({ data: { weekLabel: "Semaine du 27 janvier 2026",  status: "CLOSED", closedAt: d("2026-02-02T23:59:00") } }),
    prisma.barometreSession.create({ data: { weekLabel: "Semaine du 17 février 2026",  status: "CLOSED", closedAt: d("2026-02-23T23:59:00") } }),
    prisma.barometreSession.create({ data: { weekLabel: "Semaine du 10 mars 2026",     status: "CLOSED", closedAt: d("2026-03-16T23:59:00") } }),
    prisma.barometreSession.create({ data: { weekLabel: "Semaine du 31 mars 2026",     status: "CLOSED", closedAt: d("2026-04-06T23:59:00") } }),
    prisma.barometreSession.create({ data: { weekLabel: "Semaine du 7 avril 2026",     status: "OPEN"  } }),
  ])

  // Données mood réalistes par session : légère remontée du moral en cours de semestre
  const barometreData: { session: typeof barSessions[number]; responses: { userId: string; mood: number; wellbeing: number; comment?: string }[] }[] = [
    {
      session: barSessions[0],
      responses: [
        { userId: alice.id,   mood: 3, wellbeing: 3, comment: "Rentrée chargée mais motivée pour le semestre !" },
        { userId: bob.id,     mood: 2, wellbeing: 2, comment: "Beaucoup de travail à rattraper après les fêtes." },
        { userId: chloé.id,   mood: 4, wellbeing: 4 },
        { userId: dylan.id,   mood: 3, wellbeing: 3, comment: "Ambiance plutôt bonne sur le campus." },
        { userId: emma.id,    mood: 2, wellbeing: 3 },
        { userId: farid.id,   mood: 3, wellbeing: 2 },
      ],
    },
    {
      session: barSessions[1],
      responses: [
        { userId: alice.id,   mood: 3, wellbeing: 3 },
        { userId: bob.id,     mood: 3, wellbeing: 3, comment: "Mon ticket a été résolu rapidement, je suis rassuré." },
        { userId: chloé.id,   mood: 3, wellbeing: 4, comment: "Bon rythme de travail cette semaine." },
        { userId: jade.id,    mood: 2, wellbeing: 2, comment: "Trop de partiels en même temps." },
        { userId: kevin.id,   mood: 4, wellbeing: 4 },
        { userId: léa.id,     mood: 3, wellbeing: 3 },
        { userId: farid.id,   mood: 3, wellbeing: 3 },
      ],
    },
    {
      session: barSessions[2],
      responses: [
        { userId: alice.id,   mood: 4, wellbeing: 4, comment: "Semaine tranquille, bonne organisation." },
        { userId: bob.id,     mood: 3, wellbeing: 3 },
        { userId: dylan.id,   mood: 2, wellbeing: 2, comment: "Logements trop bruyants la nuit, difficile de réviser." },
        { userId: emma.id,    mood: 3, wellbeing: 3 },
        { userId: jade.id,    mood: 4, wellbeing: 4 },
        { userId: kevin.id,   mood: 3, wellbeing: 3, comment: "Résultats des partiels encourageants." },
        { userId: mathieu.id, mood: 2, wellbeing: 2, comment: "Manque de places en bibliothèque en période d'examens." },
        { userId: nora.id,    mood: 3, wellbeing: 3 },
      ],
    },
    {
      session: barSessions[3],
      responses: [
        { userId: alice.id,   mood: 4, wellbeing: 4 },
        { userId: bob.id,     mood: 4, wellbeing: 3, comment: "Les projets budget participatif sont motivants !" },
        { userId: chloé.id,   mood: 3, wellbeing: 3 },
        { userId: emma.id,    mood: 4, wellbeing: 4, comment: "Parlement éphémère : vraiment bien d'être impliqué." },
        { userId: farid.id,   mood: 3, wellbeing: 3 },
        { userId: jade.id,    mood: 3, wellbeing: 4 },
        { userId: léa.id,     mood: 4, wellbeing: 4, comment: "Campus plus agréable depuis la rénovation sport." },
        { userId: mathieu.id, mood: 3, wellbeing: 3 },
        { userId: nora.id,    mood: 3, wellbeing: 2 },
      ],
    },
    {
      session: barSessions[4],
      responses: [
        { userId: alice.id,   mood: 4, wellbeing: 4, comment: "Fin de semestre en vue, moral au beau fixe." },
        { userId: bob.id,     mood: 3, wellbeing: 3 },
        { userId: chloé.id,   mood: 4, wellbeing: 4 },
        { userId: dylan.id,   mood: 3, wellbeing: 3, comment: "Wi-Fi toujours problématique en résidence." },
        { userId: emma.id,    mood: 5, wellbeing: 5, comment: "Super session de parlement cette semaine !" },
        { userId: farid.id,   mood: 3, wellbeing: 3 },
        { userId: jade.id,    mood: 4, wellbeing: 3 },
        { userId: kevin.id,   mood: 4, wellbeing: 4, comment: "Bonne dynamique collective." },
        { userId: léa.id,     mood: 3, wellbeing: 3 },
        { userId: mathieu.id, mood: 4, wellbeing: 4 },
      ],
    },
    {
      session: barSessions[5],
      responses: [
        { userId: alice.id,   mood: 4, wellbeing: 4, comment: "Semaine de présentation — un peu stressée mais contente." },
        { userId: chloé.id,   mood: 3, wellbeing: 3 },
        { userId: emma.id,    mood: 4, wellbeing: 4 },
        { userId: jade.id,    mood: 3, wellbeing: 3, comment: "Beaucoup de projets à rendre cette semaine." },
        { userId: nora.id,    mood: 2, wellbeing: 2, comment: "Problème de dérogation toujours sans réponse." },
      ],
    },
  ]

  for (const { session, responses } of barometreData) {
    await prisma.barometreResponse.createMany({
      data: responses.map(r => ({
        sessionId: session.id,
        userId: r.userId,
        moodScore: r.mood,
        wellbeing: r.wellbeing,
        comment: r.comment,
      })),
    })
  }

  // ── Budget Participatif (7 projets) ───────────────────────────────────────
  const proj1 = await prisma.budgetProject.create({
    data: {
      title: "Rénovation complète de la salle de sport",
      description: "Remplacement des équipements cardio vétustes, rénovation des vestiaires, amélioration de l'éclairage et installation de miroirs. La salle n'a pas été rénovée depuis 2018.",
      amount: 18500,
      category: "SPORT",
      status: "COMPLETED",
      createdById: admin.id,
      createdAt: d("2026-01-15T10:00:00"),
    },
  })
  await prisma.projectVote.createMany({
    data: [
      { projectId: proj1.id, userId: alice.id,   vote: "FOR"  },
      { projectId: proj1.id, userId: bob.id,     vote: "FOR"  },
      { projectId: proj1.id, userId: chloé.id,   vote: "FOR"  },
      { projectId: proj1.id, userId: dylan.id,   vote: "FOR"  },
      { projectId: proj1.id, userId: emma.id,    vote: "FOR"  },
      { projectId: proj1.id, userId: farid.id,   vote: "FOR"  },
      { projectId: proj1.id, userId: jade.id,    vote: "FOR"  },
      { projectId: proj1.id, userId: kevin.id,   vote: "FOR"  },
      { projectId: proj1.id, userId: léa.id,     vote: "FOR"  },
      { projectId: proj1.id, userId: mathieu.id, vote: "FOR"  },
      { projectId: proj1.id, userId: nora.id,    vote: "AGAINST" },
    ],
  })

  const proj2 = await prisma.budgetProject.create({
    data: {
      title: "Création d'un FabLab étudiant",
      description: "Espace de fabrication numérique avec 4 imprimantes 3D, une découpeuse laser, du matériel Arduino et Raspberry Pi. Formation gratuite pour tous les étudiants.",
      amount: 28000,
      category: "NUMERIQUE",
      status: "FUNDED",
      createdById: admin.id,
      createdAt: d("2026-01-20T10:00:00"),
    },
  })
  await prisma.projectVote.createMany({
    data: [
      { projectId: proj2.id, userId: alice.id,   vote: "FOR"  },
      { projectId: proj2.id, userId: bob.id,     vote: "FOR"  },
      { projectId: proj2.id, userId: chloé.id,   vote: "FOR"  },
      { projectId: proj2.id, userId: dylan.id,   vote: "FOR"  },
      { projectId: proj2.id, userId: emma.id,    vote: "FOR"  },
      { projectId: proj2.id, userId: farid.id,   vote: "FOR"  },
      { projectId: proj2.id, userId: jade.id,    vote: "FOR"  },
      { projectId: proj2.id, userId: kevin.id,   vote: "FOR"  },
      { projectId: proj2.id, userId: léa.id,     vote: "FOR"  },
      { projectId: proj2.id, userId: mathieu.id, vote: "AGAINST" },
      { projectId: proj2.id, userId: nora.id,    vote: "FOR"  },
    ],
  })

  const proj3 = await prisma.budgetProject.create({
    data: {
      title: "Festival culturel inter-facultés — Printemps 2026",
      description: "3 jours de festival : concerts de groupes étudiants, expositions d'arts plastiques, conférences TEDx format court, et food trucks locaux. Gratuit pour tous.",
      amount: 9500,
      category: "CULTURE",
      status: "IN_PROGRESS",
      createdById: admin.id,
      createdAt: d("2026-02-01T10:00:00"),
    },
  })
  await prisma.projectVote.createMany({
    data: [
      { projectId: proj3.id, userId: alice.id,   vote: "FOR"  },
      { projectId: proj3.id, userId: bob.id,     vote: "FOR"  },
      { projectId: proj3.id, userId: chloé.id,   vote: "FOR"  },
      { projectId: proj3.id, userId: emma.id,    vote: "FOR"  },
      { projectId: proj3.id, userId: jade.id,    vote: "FOR"  },
      { projectId: proj3.id, userId: léa.id,     vote: "AGAINST" },
      { projectId: proj3.id, userId: mathieu.id, vote: "FOR"  },
      { projectId: proj3.id, userId: nora.id,    vote: "FOR"  },
    ],
  })

  const proj4 = await prisma.budgetProject.create({
    data: {
      title: "Installation de panneaux solaires sur le toit du bâtiment principal",
      description: "Projet éco-responsable : 40 panneaux photovoltaïques permettant de couvrir 30 % de la consommation électrique du campus. Économies estimées à 8 000 €/an.",
      amount: 45000,
      category: "INFRASTRUCTURE",
      status: "ACTIVE",
      createdById: admin.id,
      createdAt: d("2026-02-15T10:00:00"),
    },
  })
  await prisma.projectVote.createMany({
    data: [
      { projectId: proj4.id, userId: alice.id,   vote: "FOR"  },
      { projectId: proj4.id, userId: bob.id,     vote: "FOR"  },
      { projectId: proj4.id, userId: chloé.id,   vote: "FOR"  },
      { projectId: proj4.id, userId: dylan.id,   vote: "FOR"  },
      { projectId: proj4.id, userId: emma.id,    vote: "FOR"  },
      { projectId: proj4.id, userId: farid.id,   vote: "AGAINST" },
      { projectId: proj4.id, userId: jade.id,    vote: "FOR"  },
      { projectId: proj4.id, userId: kevin.id,   vote: "FOR"  },
      { projectId: proj4.id, userId: nora.id,    vote: "FOR"  },
    ],
  })

  const proj5 = await prisma.budgetProject.create({
    data: {
      title: "Espace détente et siestes étudiantes",
      description: "Création d'une salle calme avec fauteuils ergonomiques, lumière tamisée, et accès libre. Idéale entre deux cours ou lors des périodes d'examens.",
      amount: 6200,
      category: "INFRASTRUCTURE",
      status: "ACTIVE",
      createdById: alice.id,
      createdAt: d("2026-03-01T10:00:00"),
    },
  })
  await prisma.projectVote.createMany({
    data: [
      { projectId: proj5.id, userId: bob.id,     vote: "FOR"  },
      { projectId: proj5.id, userId: chloé.id,   vote: "FOR"  },
      { projectId: proj5.id, userId: dylan.id,   vote: "FOR"  },
      { projectId: proj5.id, userId: emma.id,    vote: "FOR"  },
      { projectId: proj5.id, userId: jade.id,    vote: "FOR"  },
      { projectId: proj5.id, userId: léa.id,     vote: "FOR"  },
      { projectId: proj5.id, userId: mathieu.id, vote: "AGAINST" },
    ],
  })

  const proj6 = await prisma.budgetProject.create({
    data: {
      title: "Tournoi sportif inter-universitaire annuel",
      description: "Organisation d'un tournoi basket/volley/football sur deux jours avec les 4 universités partenaires. Trophées, arbitres professionnels et retransmission en direct.",
      amount: 7800,
      category: "SPORT",
      status: "PROPOSED",
      createdById: dylan.id,
      createdAt: d("2026-03-20T10:00:00"),
    },
  })
  await prisma.projectVote.createMany({
    data: [
      { projectId: proj6.id, userId: alice.id,   vote: "FOR"  },
      { projectId: proj6.id, userId: bob.id,     vote: "FOR"  },
      { projectId: proj6.id, userId: farid.id,   vote: "FOR"  },
      { projectId: proj6.id, userId: kevin.id,   vote: "FOR"  },
    ],
  })

  const proj7 = await prisma.budgetProject.create({
    data: {
      title: "Podcast universitaire étudiant — Studio d'enregistrement",
      description: "Achat de matériel professionnel (micro, interface audio, logiciels) pour permettre aux étudiants de créer et diffuser leurs propres podcasts sur les thématiques campus.",
      amount: 3200,
      category: "CULTURE",
      status: "PROPOSED",
      createdById: emma.id,
      createdAt: d("2026-04-05T10:00:00"),
    },
  })
  await prisma.projectVote.createMany({
    data: [
      { projectId: proj7.id, userId: alice.id,   vote: "FOR"  },
      { projectId: proj7.id, userId: chloé.id,   vote: "FOR"  },
      { projectId: proj7.id, userId: jade.id,    vote: "FOR"  },
      { projectId: proj7.id, userId: nora.id,    vote: "FOR"  },
    ],
  })

  // ── Parlement Éphémère ────────────────────────────────────────────────────
  // Session 1 — Février 2026 (clôturée)
  const parl1 = await prisma.parlementSession.create({
    data: {
      monthLabel: "Février 2026",
      maxSeats: 5,
      status: "CLOS",
      drawnAt: d("2026-02-03T10:00:00"),
      createdAt: d("2026-01-25T10:00:00"),
    },
  })
  await prisma.parlementCandidature.createMany({
    data: [
      { sessionId: parl1.id, userId: alice.id,   isSelected: true,  motivation: "Je veux améliorer l'accès aux ressources numériques pour tous les étudiants de première année.", createdAt: d("2026-01-26T09:00:00") },
      { sessionId: parl1.id, userId: bob.id,     isSelected: true,  motivation: "Le logement étudiant est une urgence. Je veux porter ce sujet directement auprès de la direction.", createdAt: d("2026-01-26T10:00:00") },
      { sessionId: parl1.id, userId: emma.id,    isSelected: true,  motivation: "La santé mentale des étudiants est insuffisamment prise en compte. Je propose un plan d'action concret.", createdAt: d("2026-01-27T09:00:00") },
      { sessionId: parl1.id, userId: farid.id,   isSelected: true,  motivation: "Ancien représentant lycéen, je veux continuer à m'impliquer dans la vie démocratique du campus.", createdAt: d("2026-01-27T10:00:00") },
      { sessionId: parl1.id, userId: léa.id,     isSelected: true,  motivation: "Étudiante en droit, je souhaite mettre mes compétences au service de la rédaction de motions.", createdAt: d("2026-01-28T09:00:00") },
      { sessionId: parl1.id, userId: chloé.id,   isSelected: false, motivation: "Je veux améliorer les infrastructures sportives du campus.", createdAt: d("2026-01-28T10:00:00") },
      { sessionId: parl1.id, userId: mathieu.id, isSelected: false, motivation: "Défense des droits des étudiants boursiers.", createdAt: d("2026-01-29T09:00:00") },
    ],
  })

  const m1 = await prisma.parlementMotion.create({
    data: {
      title: "Extension des horaires de la bibliothèque universitaire",
      description: "Proposition d'ouvrir la BU jusqu'à 22h les lundis et jeudis, et le samedi de 9h à 17h, afin de répondre à la demande croissante des étudiants en période de révision.",
      sessionId: parl1.id,
      authorId: alice.id,
      createdAt: d("2026-02-10T10:00:00"),
    },
  })
  await prisma.motionVote.createMany({
    data: [
      { motionId: m1.id, userId: bob.id,     vote: "FOR"     },
      { motionId: m1.id, userId: emma.id,    vote: "FOR"     },
      { motionId: m1.id, userId: farid.id,   vote: "FOR"     },
      { motionId: m1.id, userId: léa.id,     vote: "FOR"     },
      { motionId: m1.id, userId: chloé.id,   vote: "ABSTAIN" },
      { motionId: m1.id, userId: dylan.id,   vote: "FOR"     },
      { motionId: m1.id, userId: jade.id,    vote: "AGAINST" },
      { motionId: m1.id, userId: kevin.id,   vote: "FOR"     },
      { motionId: m1.id, userId: mathieu.id, vote: "FOR"     },
      { motionId: m1.id, userId: nora.id,    vote: "FOR"     },
    ],
  })

  const m2 = await prisma.parlementMotion.create({
    data: {
      title: "Création d'un fond de solidarité étudiant d'urgence",
      description: "Mise en place d'un fond de 5 000 € alimenté par l'université pour aider les étudiants en situation de précarité financière imprévue (panne d'équipement, frais médicaux…).",
      sessionId: parl1.id,
      authorId: bob.id,
      createdAt: d("2026-02-12T10:00:00"),
    },
  })
  await prisma.motionVote.createMany({
    data: [
      { motionId: m2.id, userId: alice.id,   vote: "FOR"     },
      { motionId: m2.id, userId: emma.id,    vote: "FOR"     },
      { motionId: m2.id, userId: farid.id,   vote: "FOR"     },
      { motionId: m2.id, userId: léa.id,     vote: "FOR"     },
      { motionId: m2.id, userId: chloé.id,   vote: "FOR"     },
      { motionId: m2.id, userId: dylan.id,   vote: "FOR"     },
      { motionId: m2.id, userId: jade.id,    vote: "FOR"     },
      { motionId: m2.id, userId: kevin.id,   vote: "AGAINST" },
      { motionId: m2.id, userId: mathieu.id, vote: "FOR"     },
      { motionId: m2.id, userId: nora.id,    vote: "ABSTAIN" },
    ],
  })

  const m3 = await prisma.parlementMotion.create({
    data: {
      title: "Instaurer une cellule d'écoute psychologique anonyme sur le campus",
      description: "Recrutement d'un psychologue universitaire à temps partiel et création d'un numéro d'écoute anonyme pour les étudiants en détresse. Financement par rediection du budget bien-être.",
      sessionId: parl1.id,
      authorId: emma.id,
      createdAt: d("2026-02-15T10:00:00"),
    },
  })
  await prisma.motionVote.createMany({
    data: [
      { motionId: m3.id, userId: alice.id,   vote: "FOR"     },
      { motionId: m3.id, userId: bob.id,     vote: "FOR"     },
      { motionId: m3.id, userId: farid.id,   vote: "FOR"     },
      { motionId: m3.id, userId: léa.id,     vote: "FOR"     },
      { motionId: m3.id, userId: chloé.id,   vote: "FOR"     },
      { motionId: m3.id, userId: dylan.id,   vote: "ABSTAIN" },
      { motionId: m3.id, userId: jade.id,    vote: "FOR"     },
      { motionId: m3.id, userId: kevin.id,   vote: "FOR"     },
      { motionId: m3.id, userId: mathieu.id, vote: "FOR"     },
      { motionId: m3.id, userId: nora.id,    vote: "FOR"     },
    ],
  })

  // Session 2 — Mars 2026 (active)
  const parl2 = await prisma.parlementSession.create({
    data: {
      monthLabel: "Mars 2026",
      maxSeats: 5,
      status: "ACTIF",
      drawnAt: d("2026-03-03T10:00:00"),
      createdAt: d("2026-02-24T10:00:00"),
    },
  })
  await prisma.parlementCandidature.createMany({
    data: [
      { sessionId: parl2.id, userId: chloé.id,   isSelected: true,  motivation: "Je veux améliorer les infrastructures sportives et l'accès aux équipements.", createdAt: d("2026-02-25T09:00:00") },
      { sessionId: parl2.id, userId: dylan.id,   isSelected: true,  motivation: "Le logement en résidence est dégradé. Je veux porter les doléances des résidents.", createdAt: d("2026-02-25T10:00:00") },
      { sessionId: parl2.id, userId: jade.id,    isSelected: true,  motivation: "Je souhaite m'impliquer sur les enjeux numériques et l'accessibilité des outils pédagogiques.", createdAt: d("2026-02-26T09:00:00") },
      { sessionId: parl2.id, userId: mathieu.id, isSelected: true,  motivation: "Représenter les étudiants boursiers et ceux en situation de handicap.", createdAt: d("2026-02-26T10:00:00") },
      { sessionId: parl2.id, userId: nora.id,    isSelected: true,  motivation: "Défense de l'égalité d'accès aux formations et aux dérogations.", createdAt: d("2026-02-27T09:00:00") },
      { sessionId: parl2.id, userId: kevin.id,   isSelected: false, motivation: "Améliorer la communication entre l'administration et les étudiants.", createdAt: d("2026-02-27T10:00:00") },
    ],
  })

  const m4 = await prisma.parlementMotion.create({
    data: {
      title: "Passage au zéro plastique dans les cafétérias du campus",
      description: "Suppression progressive de tous les emballages plastiques à usage unique dans les 3 cafétérias. Passage aux emballages compostables d'ici septembre 2026.",
      sessionId: parl2.id,
      authorId: chloé.id,
      createdAt: d("2026-03-10T10:00:00"),
    },
  })
  await prisma.motionVote.createMany({
    data: [
      { motionId: m4.id, userId: alice.id,   vote: "FOR"     },
      { motionId: m4.id, userId: bob.id,     vote: "FOR"     },
      { motionId: m4.id, userId: dylan.id,   vote: "FOR"     },
      { motionId: m4.id, userId: emma.id,    vote: "FOR"     },
      { motionId: m4.id, userId: farid.id,   vote: "AGAINST" },
      { motionId: m4.id, userId: jade.id,    vote: "FOR"     },
      { motionId: m4.id, userId: kevin.id,   vote: "FOR"     },
      { motionId: m4.id, userId: léa.id,     vote: "FOR"     },
      { motionId: m4.id, userId: mathieu.id, vote: "FOR"     },
    ],
  })

  const m5 = await prisma.parlementMotion.create({
    data: {
      title: "Instaurer une charte de réponse obligatoire aux tickets sous 48h",
      description: "Engagement de l'administration à accuser réception de tout ticket sous 24h et à fournir une première réponse sous 48h ouvrées. Mesure de satisfaction intégrée à Agora360.",
      sessionId: parl2.id,
      authorId: jade.id,
      createdAt: d("2026-03-15T10:00:00"),
    },
  })
  await prisma.motionVote.createMany({
    data: [
      { motionId: m5.id, userId: alice.id,   vote: "FOR"     },
      { motionId: m5.id, userId: bob.id,     vote: "FOR"     },
      { motionId: m5.id, userId: chloé.id,   vote: "FOR"     },
      { motionId: m5.id, userId: dylan.id,   vote: "FOR"     },
      { motionId: m5.id, userId: emma.id,    vote: "FOR"     },
      { motionId: m5.id, userId: farid.id,   vote: "FOR"     },
      { motionId: m5.id, userId: kevin.id,   vote: "ABSTAIN" },
      { motionId: m5.id, userId: léa.id,     vote: "FOR"     },
      { motionId: m5.id, userId: nora.id,    vote: "FOR"     },
    ],
  })

  // Session 3 — Avril 2026 (candidatures ouvertes)
  const parl3 = await prisma.parlementSession.create({
    data: {
      monthLabel: "Avril 2026",
      maxSeats: 5,
      status: "CANDIDATURES",
      createdAt: d("2026-04-01T10:00:00"),
    },
  })
  await prisma.parlementCandidature.createMany({
    data: [
      { sessionId: parl3.id, userId: alice.id,   isSelected: false, motivation: "Après ma participation au baromètre, je veux aller plus loin dans la co-décision.", createdAt: d("2026-04-02T09:00:00") },
      { sessionId: parl3.id, userId: bob.id,     isSelected: false, motivation: "Je souhaite porter la question du fond de solidarité étudiant adopté en février.", createdAt: d("2026-04-02T10:00:00") },
      { sessionId: parl3.id, userId: farid.id,   isSelected: false, motivation: "Après mon expérience en février, je veux continuer à m'investir pour le campus.", createdAt: d("2026-04-03T09:00:00") },
      { sessionId: parl3.id, userId: kevin.id,   isSelected: false, motivation: "Améliorer la communication entre l'administration et les étudiants est ma priorité.", createdAt: d("2026-04-03T10:00:00") },
      { sessionId: parl3.id, userId: léa.id,     isSelected: false, motivation: "Je veux m'assurer que la charte 48h votée en mars est bien respectée.", createdAt: d("2026-04-04T09:00:00") },
      { sessionId: parl3.id, userId: emma.id,    isSelected: false, motivation: "Suivi des actions santé mentale initiées lors du parlement de février.", createdAt: d("2026-04-04T10:00:00") },
      { sessionId: parl3.id, userId: mathieu.id, isSelected: false, motivation: "Défense continue des droits des étudiants en situation de handicap.", createdAt: d("2026-04-05T09:00:00") },
    ],
  })

  // ── Points & Badges (gamification réaliste) ───────────────────────────────
  type PointDef = { action: "TICKET_SUBMITTED"|"TICKET_RESOLVED"|"BAROMETRE_RESPONDED"|"BUDGET_VOTED"|"PARLEMENT_APPLIED"|"PARLEMENT_ELECTED"|"MOTION_CREATED"|"MOTION_VOTED"|"FAQ_ANSWER_GIVEN"|"FAQ_ANSWER_ACCEPTED"; points: number; label: string; createdAt: Date }

  const userPoints: Record<string, PointDef[]> = {
    [alice.id]: [
      { action: "TICKET_SUBMITTED",    points: 10, label: "Ticket soumis — Inscription bloquée",              createdAt: d("2026-01-15T09:00:00") },
      { action: "TICKET_SUBMITTED",    points: 10, label: "Ticket soumis — Certificat de scolarité",          createdAt: d("2026-01-10T10:00:00") },
      { action: "TICKET_SUBMITTED",    points: 10, label: "Ticket soumis — Mot de passe ENT",                 createdAt: d("2026-03-04T16:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 06 jan",               createdAt: d("2026-01-08T10:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 27 jan",               createdAt: d("2026-01-29T10:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 17 fév",               createdAt: d("2026-02-19T10:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 10 mar",               createdAt: d("2026-03-12T10:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 31 mar",               createdAt: d("2026-04-02T10:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 7 avr",                createdAt: d("2026-04-09T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — Rénovation salle de sport",                 createdAt: d("2026-01-20T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — FabLab étudiant",                          createdAt: d("2026-01-25T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — Festival culturel",                        createdAt: d("2026-02-05T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — Panneaux solaires",                        createdAt: d("2026-02-20T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — Espace détente",                           createdAt: d("2026-03-05T10:00:00") },
      { action: "PARLEMENT_APPLIED",   points: 15, label: "Candidature — Parlement Éphémère Fév 2026",       createdAt: d("2026-01-26T09:00:00") },
      { action: "PARLEMENT_ELECTED",   points: 25, label: "Élue au Parlement — Fév 2026",                    createdAt: d("2026-02-03T10:00:00") },
      { action: "MOTION_CREATED",      points: 15, label: "Motion déposée — Horaires BU",                    createdAt: d("2026-02-10T10:00:00") },
      { action: "MOTION_VOTED",        points: 5,  label: "Vote motion — Fond solidarité",                   createdAt: d("2026-02-13T10:00:00") },
      { action: "MOTION_VOTED",        points: 5,  label: "Vote motion — Cellule écoute psy",                createdAt: d("2026-02-16T10:00:00") },
      { action: "MOTION_VOTED",        points: 5,  label: "Vote motion — Zéro plastique cafétérias",         createdAt: d("2026-03-12T10:00:00") },
      { action: "MOTION_VOTED",        points: 5,  label: "Vote motion — Charte 48h tickets",                createdAt: d("2026-03-16T10:00:00") },
      { action: "PARLEMENT_APPLIED",   points: 15, label: "Candidature — Parlement Éphémère Avr 2026",       createdAt: d("2026-04-02T09:00:00") },
    ],
    [bob.id]: [
      { action: "TICKET_SUBMITTED",    points: 10, label: "Ticket soumis — Bourse CROUS",                    createdAt: d("2026-02-05T08:15:00") },
      { action: "TICKET_SUBMITTED",    points: 10, label: "Ticket soumis — Coworking fermé",                 createdAt: d("2026-04-05T09:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 06 jan",               createdAt: d("2026-01-08T10:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 27 jan",               createdAt: d("2026-01-29T10:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 10 mar",               createdAt: d("2026-03-12T10:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 31 mar",               createdAt: d("2026-04-02T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — Rénovation salle de sport",                 createdAt: d("2026-01-20T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — FabLab étudiant",                          createdAt: d("2026-01-25T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — Festival culturel",                        createdAt: d("2026-02-05T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — Panneaux solaires",                        createdAt: d("2026-02-20T10:00:00") },
      { action: "PARLEMENT_APPLIED",   points: 15, label: "Candidature — Parlement Éphémère Fév 2026",       createdAt: d("2026-01-26T10:00:00") },
      { action: "PARLEMENT_ELECTED",   points: 25, label: "Élu au Parlement — Fév 2026",                     createdAt: d("2026-02-03T10:00:00") },
      { action: "MOTION_CREATED",      points: 15, label: "Motion déposée — Fond solidarité",                createdAt: d("2026-02-12T10:00:00") },
      { action: "MOTION_VOTED",        points: 5,  label: "Vote motion — Horaires BU",                       createdAt: d("2026-02-11T10:00:00") },
      { action: "MOTION_VOTED",        points: 5,  label: "Vote motion — Cellule écoute psy",                createdAt: d("2026-02-16T10:00:00") },
      { action: "MOTION_VOTED",        points: 5,  label: "Vote motion — Zéro plastique cafétérias",         createdAt: d("2026-03-12T10:00:00") },
      { action: "MOTION_VOTED",        points: 5,  label: "Vote motion — Charte 48h tickets",                createdAt: d("2026-03-16T10:00:00") },
      { action: "PARLEMENT_APPLIED",   points: 15, label: "Candidature — Parlement Éphémère Avr 2026",       createdAt: d("2026-04-02T10:00:00") },
    ],
    [emma.id]: [
      { action: "TICKET_SUBMITTED",    points: 10, label: "Ticket soumis — VPN campus",                      createdAt: d("2026-02-12T18:00:00") },
      { action: "TICKET_SUBMITTED",    points: 10, label: "Ticket soumis — Absence enseignant",              createdAt: d("2026-03-08T12:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 17 fév",               createdAt: d("2026-02-19T10:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 10 mar",               createdAt: d("2026-03-12T10:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 31 mar",               createdAt: d("2026-04-02T10:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre — Semaine 7 avr",                createdAt: d("2026-04-09T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — Rénovation salle de sport",                 createdAt: d("2026-01-20T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — FabLab étudiant",                          createdAt: d("2026-01-25T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — Festival culturel",                        createdAt: d("2026-02-05T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — Panneaux solaires",                        createdAt: d("2026-02-20T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — Espace détente",                           createdAt: d("2026-03-05T10:00:00") },
      { action: "PARLEMENT_APPLIED",   points: 15, label: "Candidature — Parlement Éphémère Fév 2026",       createdAt: d("2026-01-27T09:00:00") },
      { action: "PARLEMENT_ELECTED",   points: 25, label: "Élue au Parlement — Fév 2026",                    createdAt: d("2026-02-03T10:00:00") },
      { action: "MOTION_CREATED",      points: 15, label: "Motion déposée — Cellule écoute psy",             createdAt: d("2026-02-15T10:00:00") },
      { action: "MOTION_VOTED",        points: 5,  label: "Vote motion — Horaires BU",                       createdAt: d("2026-02-11T10:00:00") },
      { action: "MOTION_VOTED",        points: 5,  label: "Vote motion — Fond solidarité",                   createdAt: d("2026-02-13T10:00:00") },
      { action: "MOTION_VOTED",        points: 5,  label: "Vote motion — Zéro plastique cafétérias",         createdAt: d("2026-03-12T10:00:00") },
      { action: "MOTION_VOTED",        points: 5,  label: "Vote motion — Charte 48h tickets",                createdAt: d("2026-03-16T10:00:00") },
      { action: "PARLEMENT_APPLIED",   points: 15, label: "Candidature — Parlement Éphémère Avr 2026",       createdAt: d("2026-04-04T10:00:00") },
    ],
  }

  // Points simplifiés pour les autres étudiants
  for (const student of [chloé, dylan, farid, jade, kevin, léa, mathieu, nora]) {
    userPoints[student.id] = [
      { action: "TICKET_SUBMITTED",    points: 10, label: "Ticket soumis",                                   createdAt: d("2026-02-01T10:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre",                               createdAt: d("2026-02-05T10:00:00") },
      { action: "BAROMETRE_RESPONDED", points: 5,  label: "Réponse baromètre",                               createdAt: d("2026-03-05T10:00:00") },
      { action: "BUDGET_VOTED",        points: 10, label: "Vote — FabLab étudiant",                          createdAt: d("2026-01-25T10:00:00") },
      { action: "PARLEMENT_APPLIED",   points: 15, label: "Candidature — Parlement Éphémère",                createdAt: d("2026-02-25T10:00:00") },
    ]
  }

  for (const [userId, points] of Object.entries(userPoints)) {
    await prisma.pointTransaction.createMany({ data: points.map(p => ({ ...p, userId })) })
  }

  // ── Attribution des badges ─────────────────────────────────────────────────
  const badgeGrants: { userId: string; badgeSlugs: string[] }[] = [
    { userId: alice.id,   badgeSlugs: ["FIRST_TICKET", "FIRST_VOTE", "FIRST_BAROMETRE", "ENGAGED_STUDENT", "ELECTED_MP", "MOTION_CREATOR", "ACTIVE_CITIZEN"] },
    { userId: bob.id,     badgeSlugs: ["FIRST_TICKET", "FIRST_VOTE", "FIRST_BAROMETRE", "ENGAGED_STUDENT", "ELECTED_MP", "MOTION_CREATOR", "ACTIVE_CITIZEN"] },
    { userId: emma.id,    badgeSlugs: ["FIRST_TICKET", "FIRST_VOTE", "FIRST_BAROMETRE", "ENGAGED_STUDENT", "ELECTED_MP", "MOTION_CREATOR", "ACTIVE_CITIZEN"] },
    { userId: chloé.id,   badgeSlugs: ["FIRST_TICKET", "FIRST_VOTE", "FIRST_BAROMETRE", "ENGAGED_STUDENT", "ELECTED_MP", "MOTION_CREATOR"] },
    { userId: dylan.id,   badgeSlugs: ["FIRST_TICKET", "FIRST_VOTE", "FIRST_BAROMETRE", "ELECTED_MP"] },
    { userId: farid.id,   badgeSlugs: ["FIRST_TICKET", "FIRST_VOTE", "FIRST_BAROMETRE", "ELECTED_MP"] },
    { userId: jade.id,    badgeSlugs: ["FIRST_TICKET", "FIRST_VOTE", "FIRST_BAROMETRE", "ENGAGED_STUDENT", "ELECTED_MP", "MOTION_CREATOR"] },
    { userId: kevin.id,   badgeSlugs: ["FIRST_TICKET", "FIRST_VOTE", "FIRST_BAROMETRE"] },
    { userId: léa.id,     badgeSlugs: ["FIRST_TICKET", "FIRST_VOTE", "FIRST_BAROMETRE", "ENGAGED_STUDENT", "ELECTED_MP"] },
    { userId: mathieu.id, badgeSlugs: ["FIRST_TICKET", "FIRST_VOTE", "FIRST_BAROMETRE", "ENGAGED_STUDENT"] },
    { userId: nora.id,    badgeSlugs: ["FIRST_TICKET", "FIRST_VOTE", "FIRST_BAROMETRE"] },
  ]

  for (const { userId, badgeSlugs } of badgeGrants) {
    await prisma.userBadge.createMany({
      data: badgeSlugs.map(slug => ({ userId, badgeId: badge(slug).id })),
    })
  }

  // ── FAQ ────────────────────────────────────────────────────────────────────
  type FaqDef = {
    title: string; body?: string; resolved: boolean; authorId: string; createdAt: Date
    answers: { body: string; authorId: string; accepted: boolean; createdAt: Date }[]
  }

  const faqDefs: FaqDef[] = [
    {
      title: "Comment obtenir une attestation de scolarité ?",
      body: "J'en ai besoin pour ma CAF et je ne sais pas si je dois passer par la scolarité ou si je peux la télécharger en ligne.",
      resolved: true,
      authorId: dylan.id,
      createdAt: d("2026-03-05T10:00:00"),
      answers: [
        { body: "Tu peux la télécharger directement depuis ton ENT, rubrique « Mes documents » > « Attestations ». Elle est disponible en PDF signé électroniquement, donc valide pour la CAF.", authorId: léa.id,    accepted: true,  createdAt: d("2026-03-05T11:30:00") },
        { body: "Si l'ENT ne fonctionne pas, passe directement à la scolarité bâtiment B (bureau 104), ils l'éditent en 5 minutes.", authorId: admin.id, accepted: false, createdAt: d("2026-03-05T14:00:00") },
      ],
    },
    {
      title: "Quelle est la procédure pour contester une note ?",
      body: "J'ai eu une note qui me semble incohérente avec ma copie. Est-ce que je dois passer par un ticket ou il y a une procédure officielle ?",
      resolved: true,
      authorId: kevin.id,
      createdAt: d("2026-03-12T09:00:00"),
      answers: [
        { body: "La procédure officielle est de contacter directement l'enseignant concerné dans les 15 jours suivant la publication des notes. S'il ne répond pas sous 5 jours ouvrés, tu peux ouvrir un ticket GPS Admin avec la catégorie Scolarité.", authorId: admin.id, accepted: true,  createdAt: d("2026-03-12T10:00:00") },
        { body: "J'ai fait pareil en janvier. Conseil : demande la consultation de ta copie d'abord, ça permet souvent de résoudre le malentendu sans passer par l'administration.", authorId: alice.id, accepted: false, createdAt: d("2026-03-12T11:00:00") },
      ],
    },
    {
      title: "Les salles de travail en groupe sont-elles réservables en ligne ?",
      resolved: false,
      authorId: chloé.id,
      createdAt: d("2026-03-20T14:00:00"),
      answers: [
        { body: "Oui, via l'ENT > Services > Réservation de salles. Attention, les salles de la BU se réservent séparément sur le site de la bibliothèque. Max 2h par réservation.", authorId: bob.id,   accepted: false, createdAt: d("2026-03-20T15:00:00") },
        { body: "Les salles du bâtiment C sont aussi disponibles sur l'application mobile de l'université, parfois avec des créneaux libres le soir.", authorId: farid.id, accepted: false, createdAt: d("2026-03-21T09:00:00") },
      ],
    },
    {
      title: "Comment fonctionne le système de points sur Agora360 ?",
      body: "Je vois que j'accumule des points en participant aux différentes sections mais je ne comprends pas bien comment ça marche et à quoi ça sert.",
      resolved: true,
      authorId: nora.id,
      createdAt: d("2026-03-28T11:00:00"),
      answers: [
        { body: "Les points récompensent ta participation citoyenne : répondre au baromètre (+30 pts), voter pour un projet (+20 pts), participer au parlement (+100 pts), répondre dans la FAQ (+25 pts). Une boutique sera bientôt disponible pour les échanger contre des avantages.", authorId: admin.id, accepted: true,  createdAt: d("2026-03-28T14:00:00") },
      ],
    },
    {
      title: "Est-il possible de changer de groupe de TD en cours de semestre ?",
      body: "Mon emploi du temps est incompatible avec mon mi-temps étudiant. Y a-t-il une procédure pour changer de groupe ?",
      resolved: false,
      authorId: mathieu.id,
      createdAt: d("2026-04-02T08:30:00"),
      answers: [
        { body: "C'est possible dans les 3 premières semaines du semestre, après accord de l'enseignant responsable et validation de la scolarité. Passé ce délai, il faut un motif exceptionnel (médical, professionnel avec justificatif).", authorId: alice.id, accepted: false, createdAt: d("2026-04-02T10:00:00") },
      ],
    },
    {
      title: "Y a-t-il un service d'impression gratuit pour les étudiants boursiers ?",
      resolved: false,
      authorId: emma.id,
      createdAt: d("2026-04-07T16:00:00"),
      answers: [
        { body: "Oui, les étudiants boursiers B2 et B3 bénéficient de 100 pages d'impression gratuites par mois, à utiliser dans la salle informatique du RDC bibliothèque. La quota se recharge automatiquement le 1er de chaque mois.", authorId: admin.id, accepted: false, createdAt: d("2026-04-08T09:00:00") },
        { body: "Sinon la reprographie au sous-sol du bâtiment A propose des tarifs réduits pour tous les étudiants (0,05 €/page N&B), pas besoin d'être boursier.", authorId: jade.id,  accepted: false, createdAt: d("2026-04-08T10:30:00") },
      ],
    },
    {
      title: "Comment signaler un problème de harcèlement sur le campus ?",
      body: "Une amie subit des remarques répétées d'un autre étudiant et ne sait pas à qui s'adresser.",
      resolved: true,
      authorId: léa.id,
      createdAt: d("2026-04-09T10:00:00"),
      answers: [
        { body: "Il existe une cellule de signalement dédiée : cellule-egalite@univ.fr (traitement confidentiel sous 48h). Elle peut aussi se rendre directement au service vie étudiante (bâtiment A, bureau 210) sans rendez-vous, du lundi au vendredi de 9h à 12h.", authorId: admin.id, accepted: true,  createdAt: d("2026-04-09T11:00:00") },
      ],
    },
    {
      title: "Le restaurant universitaire accepte-t-il les paiements sans contact ?",
      resolved: false,
      authorId: farid.id,
      createdAt: d("2026-04-11T12:00:00"),
      answers: [
        { body: "Oui, depuis janvier 2026 les trois RU acceptent CB, Apple Pay et Google Pay. La carte Izly reste recommandée car elle permet d'appliquer automatiquement le tarif boursier.", authorId: kevin.id, accepted: false, createdAt: d("2026-04-11T13:00:00") },
      ],
    },
  ]

  for (const def of faqDefs) {
    const q = await prisma.faqQuestion.create({
      data: {
        title: def.title,
        body: def.body ?? null,
        resolved: def.resolved,
        authorId: def.authorId,
        createdAt: def.createdAt,
      },
    })
    for (const a of def.answers) {
      await prisma.faqAnswer.create({
        data: { body: a.body, authorId: a.authorId, questionId: q.id, accepted: a.accepted, createdAt: a.createdAt },
      })
      // Award points for answering (not own question)
      if (a.authorId !== def.authorId) {
        await prisma.pointTransaction.create({
          data: {
            userId: a.authorId,
            action: "FAQ_ANSWER_GIVEN",
            points: 25,
            label: `Réponse FAQ : « ${def.title.slice(0, 60)} »`,
            createdAt: a.createdAt,
          },
        })
        if (a.accepted) {
          await prisma.pointTransaction.create({
            data: {
              userId: a.authorId,
              action: "FAQ_ANSWER_ACCEPTED",
              points: 50,
              label: `Réponse acceptée : « ${def.title.slice(0, 60)} »`,
              createdAt: a.createdAt,
            },
          })
        }
      }
    }
  }

  // ── Résumé ─────────────────────────────────────────────────────────────────
  console.log("\n✅ Seed CreaCampus terminé :\n")
  console.log("  👤 Comptes :")
  console.log("     admin@agora360.fr         / password123  (Admin)")
  for (const s of students) console.log(`     ${s.email.padEnd(30)} / password123`)
  console.log(`\n  🎫 ${ticketDefs.length} tickets (15 résolus/fermés, 4 en cours, 3 ouverts)`)
  console.log(`  📊 6 sessions baromètre (5 clôturées + 1 ouverte)`)
  console.log(`  💰 7 projets budget participatif`)
  console.log(`  🏛️  3 sessions parlement (1 clôturée, 1 active, 1 en candidatures)`)
  console.log(`  📜 5 motions avec votes`)
  console.log(`  🏅 7 badges — attribués à tous les étudiants actifs`)
  console.log(`  ⭐ Points gamification pour 11 étudiants`)
  console.log(`  💬 8 questions FAQ (4 résolues) avec réponses\n`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
