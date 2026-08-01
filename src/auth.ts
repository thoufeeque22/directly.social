 
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

    // ZAP Security Scanner credentials provider.
    // Only active when ZAP_ENABLED=true (staging only — never production).
    // Used exclusively by the /api/zap/auth route to issue a session
    // cookie for the dedicated zap@directly.social test user.
    ...(process.env.ZAP_ENABLED === 'true' ? [
      Credentials({
        id: "zap-credentials",
        name: "ZAP Scanner",
        credentials: {
          email: { label: "Email", type: "email" },
          zapSecret: { label: "ZAP Secret", type: "password" },
        },
        async authorize(credentials) {
          const expectedSecret = process.env.ZAP_AUTH_SECRET;

          if (!expectedSecret) {
            throw new Error("CRITICAL: ZAP_AUTH_SECRET is not set in staging environment.");
          }

          const email = credentials?.email as string;
          const zapSecret = credentials?.zapSecret as string;

          // Strict allowlist — only the designated scanner account
          if (email !== "zap@directly.social" || zapSecret !== expectedSecret) {
            return null;
          }

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;

          return {
            id: user.id,
            name: user.name ?? "ZAP Security Scanner",
            email: user.email,
            role: user.role,
          };
        },
      })
    ] : []),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      // Execute the base JWT callback from authConfig first
      if (authConfig.callbacks?.jwt) {
        token = await authConfig.callbacks.jwt({ token, user, trigger, session });
      }

      // Handle session updates securely using Prisma in Node.js runtime
      if (trigger === "update" && token.id) {
        try {
          const freshUser = await prisma.user.findUnique({ where: { id: token.id as string } });
          if (freshUser) {
            token.aiCredits = freshUser.aiCredits;
          }
        } catch (e) {
          console.error("Failed to fetch fresh user data during session update", e);
        }
      }

      return token;
    },
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
