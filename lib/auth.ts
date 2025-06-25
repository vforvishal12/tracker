import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // For demo purposes, we'll use a simple check
        // In production, you'd verify against hashed passwords
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            manager: true,
            directReports: true,
          },
        })

        if (user && credentials.password === "demo123") {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            managerId: user.managerId,
            department: user.department,
          }
        }

        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.managerId = user.managerId
        token.department = user.department
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.managerId = token.managerId as string
        session.user.department = token.department as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}
