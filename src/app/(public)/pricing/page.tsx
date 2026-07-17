import { Metadata } from "next";
import { LandingHeader } from '@/components/landing/Header';
import { LandingFooter } from '@/components/landing/Footer';
import { Pricing } from '@/components/landing/Pricing';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Pricing - Directly',
  description: 'Simple, honest pricing for Directly.',
};

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>
      <LandingHeader />
      <main style={{ flexGrow: 1, paddingTop: '80px' }}>
        <Suspense fallback={<div>Loading pricing...</div>}>
          <Pricing />
        </Suspense>
      </main>
      <LandingFooter />
    </div>
  );
}
