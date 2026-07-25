 
import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/core/prisma";
import { BRAND } from "@/lib/core/brand";
import { cookies } from "next/headers";
import authConfig from "./auth.config";
import { extractAccountName } from "@/lib/utils/utils";
import { Role } from "@prisma/client";
import { handleSocialLinkReward, handleUserCreated } from "@/lib/referral/social-reward";

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

          const email = credentials?.email as string;
          const isE2EEmail = email === `tester@${BRAND.domain}` || 
                           email === `admin@${BRAND.domain}` || 
                           (email && (email.startsWith("tester-") || email.startsWith("admin-")) && email.endsWith(`@${BRAND.domain}`));
          
          if (
            expectedPassword &&
            isE2EEmail && 
            credentials?.password === expectedPassword
          ) {
            const user = await prisma.user.findFirst({
              where: { email }
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
    async createUser({ user }) {
      await handleUserCreated(user);
    },
    async linkAccount({ account, profile, user }) {
      await handleSocialLinkReward(account, profile, user?.id);
    },
  },
  debug: process.env.NODE_ENV !== 'production',
});
