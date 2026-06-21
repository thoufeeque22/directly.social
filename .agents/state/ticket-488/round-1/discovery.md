# Technical Blueprint & Test Specification: Technical SEO Foundation (Ticket #488)

## 1. Context & Architectural Overview
The objective is to implement dynamic Next.js metadata and Schema.org JSON-LD structured data for `directly.social`'s main landing page on `/`.
Since `/` is shared between authenticated users (Dashboard) and unauthenticated guests (Landing Page), the page metadata is server-rendered for both. To prevent authenticated users from seeing the marketing title ("Directly Social | The Native Social Media Creator Studio") in their browser tab, a client-side `useEffect` will be added in `DashboardClient.tsx` to dynamically override the page title after hydration.

## 2. Technical Blueprint

### A. Next.js Metadata API in `src/app/page.tsx`
The static metadata block in `src/app/page.tsx` will be replaced with a fully configured `Metadata` export using the `BRAND` constants.

```typescript
import { Metadata } from "next";
import { BRAND } from "@/lib/core/brand";

export const metadata: Metadata = {
  title: `${BRAND.name} | The Native Social Media Creator Studio`,
  description: `Publish native Short, Reel, and TikTok video formats directly using your own API keys. No middleware servers, no markups, complete data privacy, and Bring Your Own Storage (BYOS).`,
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
    'short-form video distribution'
  ],
  alternates: {
    canonical: BRAND.url,
  },
  openGraph: {
    title: `${BRAND.name} - The Native Social Media Client`,
    description: `Stop paying the SaaS tax. Publish native shorts, reels, and TikToks directly from your device using your own keys and cloud storage.`,
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
    description: `Publish native video content directly using your own API keys. No markups, no middleware database, and complete data privacy.`,
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
```

### B. Schema.org JSON-LD Graph Injection in `src/app/page.tsx`
We will render a `<script type="application/ld+json">` tag within the unauthenticated (`!session`) return block of `src/app/page.tsx`.

```html
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${BRAND.url}/#organization`,
          "name": BRAND.name,
          "url": BRAND.url,
          "logo": {
            "@type": "ImageObject",
            "@id": `${BRAND.url}/#logo`,
            "url": `${BRAND.url}/logo.png`,
            "caption": `${BRAND.name} Logo`
          },
          "sameAs": [
            "https://github.com/thoufeeque22/directly.social",
            "https://x.com/directlysocial",
            "https://discord.gg/directly"
          ]
        },
        {
          "@type": "SoftwareApplication",
          "@id": `${BRAND.url}/#software`,
          "name": BRAND.name,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web, iOS, Android",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "USD",
            "lowPrice": "0",
            "highPrice": "0",
            "offerCount": "1",
            "offers": [
              {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "name": "Local Core",
                "description": "Free forever local-first core publishing features using your own API keys."
              }
            ]
          },
          "description": "The Native Social Client. A privacy-first, local-first creator studio to publish content directly to TikTok, Instagram, and YouTube using official APIs without middleware servers.",
          "publisher": {
            "@id": `${BRAND.url}/#organization`
          }
        },
        {
          "@type": "WebSite",
          "@id": `${BRAND.url}/#website`,
          "url": BRAND.url,
          "name": BRAND.name,
          "description": BRAND.tagline,
          "publisher": {
            "@id": `${BRAND.url}/#organization`
          }
        }
      ]
    })
  }}
/>
```

### C. Client-Side Title Update in `src/components/dashboard/DashboardClient.tsx`
Add a client-side hook in the dashboard client component:
```typescript
useEffect(() => {
  document.title = `Dashboard | ${BRAND.name}`;
}, []);
```
This dynamic title update will execute on mount, modifying the browser tab title for logged-in users while preserving SEO metadata for crawler indexing.

### D. Asset Creation
Create placeholder/mock image files in the `public/` directory:
- `public/logo.png`
- `public/og-image.png`

## 3. Test Specification

### A. Automated E2E Test Suite (`src/__tests__/e2e/seo.spec.ts`)
A Playwright E2E test file will be written to assert the landing page SEO elements:
1. **Title Check**: Assert that `document.title` on the home route matches `${BRAND.name} | The Native Social Media Creator Studio` when unauthenticated.
2. **Meta Tags Check**: Assert that metadata tags (description, keywords, canonical link, robots) match specified values in the document head.
3. **OpenGraph & Twitter Card Tags**: Assert that `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` are correctly present and equal to expected brand values.
4. **Structured Data Check**: Fetch the content of `<script type="application/ld+json">`, parse it as JSON, and assert that:
   - `@context` is `https://schema.org`.
   - `@graph` contains three objects with types `Organization`, `SoftwareApplication`, and `WebSite`.
   - All references to URLs use the correct `BRAND.url`.

### B. Verification Run Command
- `npx playwright test src/__tests__/e2e/seo.spec.ts`

## [2026-06-21 11:53:21] Verdict: APPROVED
# Technical Blueprint & Test Specification: Technical SEO Foundation (Ticket #488)

## 1. Context & Architectural Overview
The objective is to implement dynamic Next.js metadata and Schema.org JSON-LD structured data for `directly.social`'s main landing page on `/`.
Since `/` is shared between authenticated users (Dashboard) and unauthenticated guests (Landing Page), the page metadata is server-rendered for both. To prevent authenticated users from seeing the marketing title ("Directly Social | The Native Social Media Creator Studio") in their browser tab, a client-side `useEffect` will be added in `DashboardClient.tsx` to dynamically override the page title after hydration.

## 2. Technical Blueprint

### A. Next.js Metadata API in `src/app/page.tsx`
The static metadata block in `src/app/page.tsx` will be replaced with a fully configured `Metadata` export using the `BRAND` constants.

```typescript
import { Metadata } from "next";
import { BRAND } from "@/lib/core/brand";

export const metadata: Metadata = {
  title: `${BRAND.name} | The Native Social Media Creator Studio`,
  description: `Publish native Short, Reel, and TikTok video formats directly using your own API keys. No middleware servers, no markups, complete data privacy, and Bring Your Own Storage (BYOS).`,
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
    'short-form video distribution'
  ],
  alternates: {
    canonical: BRAND.url,
  },
  openGraph: {
    title: `${BRAND.name} - The Native Social Media Client`,
    description: `Stop paying the SaaS tax. Publish native shorts, reels, and TikToks directly from your device using your own keys and cloud storage.`,
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
    description: `Publish native video content directly using your own API keys. No markups, no middleware database, and complete data privacy.`,
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
```

### B. Schema.org JSON-LD Graph Injection in `src/app/page.tsx`
We will render a `<script type="application/ld+json">` tag within the unauthenticated (`!session`) return block of `src/app/page.tsx`.

```html
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${BRAND.url}/#organization`,
          "name": BRAND.name,
          "url": BRAND.url,
          "logo": {
            "@type": "ImageObject",
            "@id": `${BRAND.url}/#logo`,
            "url": `${BRAND.url}/logo.png`,
            "caption": `${BRAND.name} Logo`
          },
          "sameAs": [
            "https://github.com/thoufeeque22/directly.social",
            "https://x.com/directlysocial",
            "https://discord.gg/directly"
          ]
        },
        {
          "@type": "SoftwareApplication",
          "@id": `${BRAND.url}/#software`,
          "name": BRAND.name,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web, iOS, Android",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "USD",
            "lowPrice": "0",
            "highPrice": "0",
            "offerCount": "1",
            "offers": [
              {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "name": "Local Core",
                "description": "Free forever local-first core publishing features using your own API keys."
              }
            ]
          },
          "description": "The Native Social Client. A privacy-first, local-first creator studio to publish content directly to TikTok, Instagram, and YouTube using official APIs without middleware servers.",
          "publisher": {
            "@id": `${BRAND.url}/#organization`
          }
        },
        {
          "@type": "WebSite",
          "@id": `${BRAND.url}/#website`,
          "url": BRAND.url,
          "name": BRAND.name,
          "description": BRAND.tagline,
          "publisher": {
            "@id": `${BRAND.url}/#organization`
          }
        }
      ]
    })
  }}
/>
```

### C. Client-Side Title Update in `src/components/dashboard/DashboardClient.tsx`
Add a client-side hook in the dashboard client component:
```typescript
useEffect(() => {
  document.title = `Dashboard | ${BRAND.name}`;
}, []);
```
This dynamic title update will execute on mount, modifying the browser tab title for logged-in users while preserving SEO metadata for crawler indexing.

### D. Asset Creation
Create placeholder/mock image files in the `public/` directory:
- `public/logo.png`
- `public/og-image.png`

## 3. Test Specification

### A. Automated E2E Test Suite (`src/__tests__/e2e/seo.spec.ts`)
A Playwright E2E test file will be written to assert the landing page SEO elements:
1. **Title Check**: Assert that `document.title` on the home route matches `${BRAND.name} | The Native Social Media Creator Studio` when unauthenticated.
2. **Meta Tags Check**: Assert that metadata tags (description, keywords, canonical link, robots) match specified values in the document head.
3. **OpenGraph & Twitter Card Tags**: Assert that `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` are correctly present and equal to expected brand values.
4. **Structured Data Check**: Fetch the content of `<script type="application/ld+json">`, parse it as JSON, and assert that:
   - `@context` is `https://schema.org`.
   - `@graph` contains three objects with types `Organization`, `SoftwareApplication`, and `WebSite`.
   - All references to URLs use the correct `BRAND.url`.

### B. Verification Run Command
- `npx playwright test src/__tests__/e2e/seo.spec.ts`

