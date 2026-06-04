import { Metadata } from "next";
import { auth } from "@/auth";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { Suspense } from "react";
import { getUserAccounts, getPlatformPreferences, getAIStylePreference, getAIProviderPreference, getAIStyleModePreference } from "@/app/actions/user";
import { getByosConfigAction } from "@/lib/actions/settings";
import { AITier, StyleMode } from "@/lib/core/constants";
import { AIProvider } from "@/lib/core/ai";
import Link from 'next/link';

// Landing Page Components
import { IntegrationsStrip } from '@/components/login/IntegrationsStrip';
import { PhilosophySection } from '@/components/login/PhilosophySection';
import { FeaturesSection } from '@/components/login/FeaturesSection';
import { DashboardMockup } from '@/components/login/DashboardMockup';
import { WorkflowSection } from '@/components/login/WorkflowSection';
import { FAQSection } from '@/components/login/FAQSection';
import { Footer } from '@/components/layout/Footer';
import styles from '@/app/login/Login.module.css'; // Reusing landing page styles
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export const metadata: Metadata = { title: "Dashboard | Directly.social" };

export default async function Home() {
  const session = await auth();

  // If NOT authenticated, render the Landing Page
  if (!session) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.heroWrapper}>
          <div className={styles.contentWrapper}>
            <section className={styles.heroFeatureSection} style={{ alignItems: 'center', textAlign: 'center', paddingTop: '4rem' }}>
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle} style={{ fontSize: '4rem' }}>
                  Automate your <br />
                  Social presence.
                </h1>
                <p className={styles.heroSubtitle} style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                  One-click distribution to TikTok, Instagram, and YouTube Shorts without the automation fees.
                </p>
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <button className={styles.loginBtn} style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', padding: '1rem 2rem', fontSize: '1.1rem', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.75rem', fontWeight: 600 }}>
                    <RocketLaunchIcon />
                    Get Started for Free
                  </button>
                </Link>
              </div>
            </section>
          </div>
          <DashboardMockup />
        </div>

        <IntegrationsStrip />
        <WorkflowSection />
        <FeaturesSection />
        <PhilosophySection />
        <FAQSection />
        <Footer />
      </div>
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
