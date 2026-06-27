import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Providers } from "@/components/Providers";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

import { auth } from "@/auth";

import { BRAND } from "@/lib/core/brand";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} | Automated Poster`,
    template: `%s | ${BRAND.name}`,
  },
  description: "Next-gen social media distribution dashboard",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

import { prisma } from "@/lib/core/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  let isFreeTier = true;
  let tierName = "Free Starter";
  
  if (session?.user?.id) {
    const profile = await prisma.billingProfile.findUnique({
      where: { userId: session.user.id },
      select: { subscriptionTier: true, subscriptionStatus: true }
    });
    
    if (profile) {
      if (profile.subscriptionStatus === "ACTIVE" && profile.subscriptionTier !== "FREE_STARTER" && profile.subscriptionTier !== "FREE_HACKER") {
        isFreeTier = false;
      }
      
      // Format FREE_STARTER -> Free Starter
      tierName = profile.subscriptionTier
        .split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <AppRouterCacheProvider options={{ key: 'css' }}>
          <Providers session={session}>
            <LayoutWrapper session={session} isFreeTier={isFreeTier} tierName={tierName}>
              {children}
            </LayoutWrapper>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
