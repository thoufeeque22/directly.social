import { Metadata } from "next";
import { auth } from "@/auth";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { Suspense } from "react";
import { getUserAccounts } from "@/app/actions/user/accounts";
import { getPlatformPreferences } from "@/app/actions/user/platform";
import { getAIStylePreference, getAIStyleModePreference } from "@/app/actions/user/ai-style";
import { getAIProviderPreference } from "@/app/actions/user/ai-provider";
import { getByosConfigAction } from "@/lib/actions/settings";
import { AITier, StyleMode } from "@/lib/core/constants";
import { AIProvider } from "@/lib/core/ai";

import { prisma } from "@/lib/core/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AppHome() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const [accounts, preferences, aiStyle, aiProvider, aiStyleMode, byosConfig, profile] = await Promise.all([
    getUserAccounts(), getPlatformPreferences(), getAIStylePreference(),
    getAIProviderPreference(), getAIStyleModePreference(), getByosConfigAction(),
    prisma.billingProfile.findUnique({
      where: { userId: session.user.id },
      select: { subscriptionTier: true, subscriptionStatus: true }
    })
  ]);

  let isFreeTier = true;
  let tierName = "Free Starter";
  
  if (profile) {
    if (profile.subscriptionStatus === "ACTIVE" && profile.subscriptionTier !== "FREE_STARTER" && profile.subscriptionTier !== "FREE_HACKER") {
      isFreeTier = false;
    }
    tierName = profile.subscriptionTier
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

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
