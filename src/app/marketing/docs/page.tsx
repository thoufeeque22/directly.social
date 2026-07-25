import { Metadata } from 'next';
import { BRAND } from '@/lib/core/brand';
import DocsClient from './DocsClient';

export const metadata: Metadata = {
  title: 'Documentation',
  description: `Help Center and Guides for ${BRAND.name}.`,
  alternates: { canonical: `${BRAND.url}/docs` },
  openGraph: {
    title: 'Documentation',
    description: `Help Center and Guides for ${BRAND.name}.`,
    url: `${BRAND.url}/docs`,
    siteName: BRAND.name,
    images: [{ url: `${BRAND.url}/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation',
    description: `Help Center and Guides for ${BRAND.name}.`,
    images: [`${BRAND.url}/og-image.png`],
  },
};

export default function DocsPage() {
  return <DocsClient />;
}
