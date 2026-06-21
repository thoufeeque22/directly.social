import { Metadata } from 'next';
import { BRAND } from '@/lib/core/brand';

export const homeMetadata: Metadata = {
  title: `${BRAND.name} | The Native Social Media Creator Studio`,
  description: 'Publish native Short, Reel, and TikTok video formats directly using your own API keys. No middleware servers, no markups, complete data privacy, and Bring Your Own Storage (BYOS).',
  keywords: [
    'social media manager',
    'native social client',
    'auto poster',
    'tiktok scheduler',
    'instagram reels scheduler',
    'youtube shorts poster',
    'privacy first social tool',
    'bring your own keys',
    'byos storage',
    'short-form video distribution',
  ],
  alternates: {
    canonical: BRAND.url,
  },
  openGraph: {
    title: `${BRAND.name} - The Native Social Media Client`,
    description: 'Stop paying the SaaS tax. Publish native shorts, reels, and TikToks directly from your device using your own keys and cloud storage.',
    url: BRAND.url,
    siteName: BRAND.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BRAND.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${BRAND.name} - Native Social Media Creator Studio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} - The Native Social Media Client`,
    description: 'Publish native video content directly using your own API keys. No markups, no middleware database, and complete data privacy.',
    images: [`${BRAND.url}/og-image.png`],
    creator: '@directlysocial',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
