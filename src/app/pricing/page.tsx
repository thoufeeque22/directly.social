import { Metadata } from "next";
import { LandingHeader } from '@/components/landing/Header';
import { LandingFooter } from '@/components/landing/Footer';
import { Pricing } from '@/components/landing/Pricing';

import { auth } from "@/auth";

export const metadata: Metadata = {
  title: 'Pricing - Directly',
  description: 'Simple, honest pricing for Directly.',
};

export default async function PricingPage() {
  const session = await auth();
  const isAuthenticated = !!session;

  if (isAuthenticated) {
    return (
      <div style={{ padding: '2rem 1rem' }}>
        <Pricing />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>
      <LandingHeader />
      <main style={{ flexGrow: 1, paddingTop: '80px' }}>
        <Pricing />
      </main>
      <LandingFooter />
    </div>
  );
}
