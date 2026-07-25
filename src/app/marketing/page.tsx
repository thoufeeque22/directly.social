import { Metadata } from "next";
import { Suspense } from "react";

// New Landing Page Component
import { LandingPage } from '@/components/landing/LandingPage';
import { LandingFallback } from '@/components/landing/LandingFallback';
import { homeMetadata } from '@/app/metadata';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = homeMetadata;

export default function MarketingHome() {
  return (
    <>
      <Suspense fallback={<LandingFallback />}>
        <LandingPage />
      </Suspense>
      <JsonLd />
    </>
  );
}
