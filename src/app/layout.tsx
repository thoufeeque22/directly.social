import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <AppRouterCacheProvider options={{ key: 'css' }}>
          <Providers session={session}>
            {children}
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
