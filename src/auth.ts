import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/core/prisma";
import authConfig from "./auth.config";
import { extractAccountName } from "@/lib/utils/utils";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: Role;
      aiCredits?: number;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
    aiCredits?: number;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    ...(process.env.NEXT_PUBLIC_E2E === 'true' ? [
      Credentials({
        name: "E2E Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          const expectedPassword = process.env.E2E_TEST_PASSWORD;
          
          if (process.env.NEXT_PUBLIC_E2E === 'true' && !expectedPassword) {
            throw new Error("CRITICAL: E2E_TEST_PASSWORD is not set in environment.");
          }
          
          if (
            expectedPassword &&
            (credentials?.email === "tester@directly.social" || credentials?.email === "admin@directly.social") && 
            credentials?.password === expectedPassword
          ) {
            const user = await prisma.user.findFirst({
              where: { email: credentials.email }
            });

            if (user) {
              return {
                id: user.id,
                name: user.name || "E2E Tester",
                email: user.email,
                role: user.role
              };
            }
          }
          return null;
        }
      })
    ] : []),
  ],
  callbacks: {
    ...authConfig.callbacks,
  },
  events: {
    async linkAccount({ account, profile }) {
      const accountName = extractAccountName(profile);
      
      if (accountName) {
        await prisma.account.update({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          data: { accountName },
        });
      }
    },
  },
  debug: process.env.NODE_ENV !== 'production',
});
