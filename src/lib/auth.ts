import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { 
    strategy: "jwt", 
    maxAge: 8 * 60 * 60 // 8 heures
  },
  
  // Clé secrète pour le chiffrement des cookies sur Vercel
  secret: process.env.AUTH_SECRET, 

  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.passwordHash) {
            console.log("❌ Utilisateur non trouvé ou hash manquant");
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!passwordMatch) {
            console.log("❌ Mot de passe incorrect pour:", credentials.email);
            return null;
          }

          // Retourne l'objet pour le JWT
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // Le champ role doit exister dans ton schéma Prisma
          };
        } catch (error) {
          console.error("🔥 Erreur Database Auth:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // On caste l'objet user pour accéder au rôle sans erreur TS/ESLint
        const u = user as { id?: string; role?: string };
        token.role = u.role;
        token.id = u.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});