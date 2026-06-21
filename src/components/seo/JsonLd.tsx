import React from 'react';
import { BRAND } from '@/lib/core/brand';

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': `${BRAND.url}/#organization`,
              name: BRAND.name,
              url: BRAND.url,
              logo: {
                '@type': 'ImageObject',
                '@id': `${BRAND.url}/#logo`,
                url: `${BRAND.url}/logo.png`,
                caption: `${BRAND.name} Logo`,
              },
              sameAs: [
                BRAND.social.github,
                BRAND.social.twitter,
                BRAND.social.discord,
              ],
            },
            {
              '@type': 'SoftwareApplication',
              '@id': `${BRAND.url}/#software`,
              name: BRAND.name,
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web, iOS, Android',
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'USD',
                lowPrice: '0',
                highPrice: '0',
                offerCount: '1',
                offers: [
                  {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                    name: 'Local Core',
                    description: 'Free forever local-first core publishing features using your own API keys.',
                  },
                ],
              },
              description: 'The Native Social Client. A privacy-first, local-first creator studio to publish content directly to TikTok, Instagram, and YouTube using official APIs without middleware servers.',
              publisher: {
                '@id': `${BRAND.url}/#organization`,
              },
            },
            {
              '@type': 'WebSite',
              '@id': `${BRAND.url}/#website`,
              url: BRAND.url,
              name: BRAND.name,
              description: BRAND.tagline,
              publisher: {
                '@id': `${BRAND.url}/#organization`,
              },
            },
          ],
        }),
      }}
    />
  );
}
