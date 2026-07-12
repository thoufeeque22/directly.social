import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/core/prisma";
import { BRAND } from "@/lib/core/brand";
import { cookies } from "next/headers";
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
      if (!user.id) return;
      const cookieStore = await cookies();
      const referralCode = cookieStore.get('referralCode')?.value;
      if (referralCode) {
        // Prevent self-referral (though unlikely at this exact step, good practice)
        if (referralCode === user.id) return;
        const referrer = await prisma.user.findUnique({ where: { id: referralCode } });
        if (referrer) {
          await prisma.user.update({
            where: { id: user.id },
            data: { referredById: referrer.id },
          });
        }
      }
    },
    async linkAccount({ account, profile, user }) {
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

      if (user?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { referredById: true }
        });

        if (dbUser?.referredById) {
          const accountsCount = await prisma.account.count({ where: { userId: user.id } });
          // If this is their first linked account, it's a Qualified Sign-up!
          if (accountsCount === 1) {
            const referrerProfile = await prisma.billingProfile.findUnique({
              where: { userId: dbUser.referredById }
            });
            const tier = referrerProfile?.subscriptionTier || 'FREE_STARTER';
            
            // Grant +1 quota only if referrer is free
            if (tier === 'FREE_STARTER') {
              await prisma.user.update({
                where: { id: dbUser.referredById },
                data: { extraPostsQuota: { increment: 1 } }
              });
            }
          }
        }
      }
    },
  },
  debug: process.env.NODE_ENV !== 'production',
});
