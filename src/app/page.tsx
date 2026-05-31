import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { Suspense } from "react";
import { getUserAccounts, getPlatformPreferences, getAIStylePreference, getAIProviderPreference, getAIStyleModePreference } from "@/app/actions/user";
import { getByosConfigAction } from "@/lib/actions/settings";
import { AITier, StyleMode } from "@/lib/core/constants";
import { AIProvider } from "@/lib/core/ai";

export const metadata: Metadata = { title: "Dashboard | SocialStudio" };

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/login");

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
