import { Metadata } from 'next';
import { BRAND } from '@/lib/core/brand';
import PhilosophyClient from './PhilosophyClient';

export const metadata: Metadata = {
  title: 'Our Philosophy',
  description: `Why we built ${BRAND.name} differently.`,
  alternates: { canonical: `${BRAND.url}/philosophy` },
  openGraph: {
    title: 'Our Philosophy',
    description: `Why we built ${BRAND.name} differently.`,
    url: `${BRAND.url}/philosophy`,
    siteName: BRAND.name,
    images: [{ url: `${BRAND.url}/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Philosophy',
    description: `Why we built ${BRAND.name} differently.`,
    images: [`${BRAND.url}/og-image.png`],
  },
};

export default function PhilosophyPage() {
  return <PhilosophyClient />;
}
