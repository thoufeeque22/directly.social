import { Metadata } from "next";
import { auth } from "@/auth";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { Suspense } from "react";
import { Box } from "@mui/material";
import { getUserAccounts, getPlatformPreferences, getAIStylePreference, getAIProviderPreference, getAIStyleModePreference } from "@/app/actions/user";
import { getByosConfigAction } from "@/lib/actions/settings";
import { AITier, StyleMode } from "@/lib/core/constants";
import { AIProvider } from "@/lib/core/ai";

import { BRAND } from "@/lib/core/brand";

// New Landing Page Component
import { LandingPage } from '@/components/landing/LandingPage';
import { LandingFallback } from '@/components/landing/LandingFallback';
import { LandingHeader } from '@/components/landing/Header';
import { LandingFooter } from '@/components/landing/Footer';

export const metadata: Metadata = { title: `${BRAND.name} | ${BRAND.tagline}` };

export default async function Home() {
  const session = await auth();

  // If NOT authenticated, render the New Landing Page with Header/Footer
  if (!session) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <LandingHeader />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Suspense fallback={<LandingFallback />}>
            <LandingPage />
          </Suspense>
        </Box>
        <LandingFooter />
      </Box>
    );
  }

  // If authenticated, render the Dashboard
  const [accounts, preferences, aiStyle, aiProvider, aiStyleMode, byosConfig] = await Promise.all([
    getUserAccounts(), getPlatformPreferences(), getAIStylePreference(),
    getAIProviderPreference(), getAIStyleModePreference(), getByosConfigAction()
  ]);

  return (
    <Suspense fallback={<div className="p-8 text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>Loading Dashboard...</div>}>
      <DashboardClient 
        session={session} 
        initialAccounts={accounts}
        initialPreferences={preferences}
        initialAIStyle={aiStyleMode as StyleMode}
        initialAITier={aiStyle as AITier}
        initialAIProvider={aiProvider as AIProvider}
        initialByosConfig={byosConfig && 'config' in byosConfig ? (byosConfig.config as { provider: string; bucketName: string } | null) : null}
      />
    </Suspense>
  );
}
