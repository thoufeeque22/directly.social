
## [2026-06-21 11:44:28] Verdict: APPROVED
# UI/UX Product Specification: Technical SEO Foundation

**Ticket ID**: 488  
**Component**: Technical SEO Foundation  
**Version**: 1.0.0  
**Phase**: Product  
**Status**: APPROVED  
**Date**: 2026-06-21  

---

## 1. Executive Summary & Vision

The objective of **Ticket 488 (Technical SEO Foundation)** is to optimize search engine visibility, crawling efficiency, and social media discoverability for **Directly Social**'s public landing page.

As a **local-first, privacy-respecting client** that does not charge a "SaaS markup," the product's value proposition hinges on giving creators ownership of their API keys and cloud storage (BYOK/BYOS). The Technical SEO Foundation must communicate this position clearly to search engines and humans alike through optimized HTML metadata, Schema.org JSON-LD structured data graph, and semantic, theme-aware, responsive layouts.

---

## 2. Competitive Research & Industry Benchmarks

An analysis of leaders in the social media management and developer-focused SaaS spaces (e.g., Buffer, Hootsuite, Later, Postiz, Supabase) reveals key SEO patterns:

### A. Landing Page Layouts
- **High-Converting SaaS Structure**: Hero (Value Prop + CTA) $\rightarrow$ Social Proof (Supported platforms) $\rightarrow$ Comparison Grid (Us vs. Them) $\rightarrow$ Target Personas $\rightarrow$ Feature Grid $\rightarrow$ How It Works (3-step onboarding) $\rightarrow$ Pricing (Transparent plans) $\rightarrow$ FAQ Accordions $\rightarrow$ Footer.
- **Dynamic Interaction**: Scroll-triggered headers, hover animations, and dark/light modes.
- **Strict Accessibility**: Contrast ratios $\geq 4.5:1$ for body text, descriptive titles, screen-reader headings, and focus indicators.

### B. Next.js Metadata API Integration
- **Title Structures**: Benchmarks show `<brand> | <core value>` structure, keeping length between **50–60 characters** to prevent truncation in search result snippets.
- **Description Length**: **150–160 characters** containing a call-to-action (CTA) and focus keywords.
- **Canonical URLs**: Clear canonical self-references on every page to prevent duplicate content indexing (important for Next.js multi-routing or subdomains).
- **OpenGraph & Twitter Cards**: Large image previews (`1200x630px` PNG) with clear branded illustration, descriptive tags (`og:type`, `og:site_name`), and account references (`twitter:creator`).

### C. Structured Data (JSON-LD)
- Leading platforms define a unified JSON-LD graph instead of detached fragments.
- **Key Entities**:
  1. `Organization`: Identifies the corporate/open-source publisher, official logo, and social profile links (`sameAs`).
  2. `SoftwareApplication`: Defines the application class, pricing tiers (`AggregateOffer`), supported operating systems, and value proposition.
  3. `WebSite`: Provides search capabilities, site structure, and description.

---

## 3. UX Strategy & User Journey

The public landing page acts as the primary marketing funnel. The UX strategy balances high-fidelity visualization with performance and indexing optimization.

### A. The Landing Page Funnel
1. **Awareness (Hero)**: Hook the creator with a bold header ("The Local-First Creator Studio. Pro Tools. No SaaS Tax.") and visual dashboard mockup.
2. **Validation (Social Proof & Comparison)**: Prove reliability by listing supported platforms and contrasting Directly Social's direct model (Native Freedom) against traditional middlemen (Legacy Middlemen).
3. **Segmentation (Personas)**: Explicitly segment creators (Native Creators vs. Power Users & Teams) so the visitor identifies their needs immediately.
4. **Education (Features & How It Works)**: Explain technical advantages (BYOK/BYOS, Vibe Sync) and outline the simple 3-step setup.
5. **Action (Pricing & FAQ)**: Address purchasing hesitancy (Core is free forever) and answer key privacy/technical questions.

### B. Metadata Delivery Strategy
- **Crawler Path**: Since crawlers are unauthenticated, the root route (`/`) must server-render the full landing page including metadata. The `layout.tsx` file defines default fallback metadata (template format), and `src/app/page.tsx` exports specific page metadata that overrides it.
- **Client/Server Boundary**: The landing page sections (e.g., `Hero`, `SocialProof`) are marked `'use client'` where MUI icons or state are used. However, Next.js compiles the page metadata on the Server, ensuring bots parse the metadata instantly before hydrating client components.

---

## 4. UI Layout & Component Standards

The landing page must comply fully with `UI_UX.md` standards:

*   **Material UI Aesthetic**: Build a professional, modern layout.
*   **Theme Awareness**: Strictly prohibit hardcoded hex codes. All backgrounds, borders, and text colors must use theme variables (e.g., `hsl(var(--background))`, `theme.palette.divider`). Use alpha channel overlays (e.g., `hsla(var(--primary), 0.08)`) for background glows.
*   **Strict "No Emojis" Policy**: Emojis are strictly FORBIDDEN in the UI. All visual icons must use Material UI Icons (e.g., `RocketLaunchIcon` instead of 🚀, `CheckIcon` instead of ✅). Emojis are only allowed in background logs/docs.

### Section Placement and Architecture:
1.  **Header (`LandingHeader`)**: Fixed at `top: 0`, transitions to a blurry, semi-transparent background (`hsla(var(--background), 0.8)`) on scroll. Contains text buttons for primary landing sections and the main "Get Started" call-to-action.
2.  **Hero**: Large typography (`h1` with `fontWeight: 800`) highlighting "Local-First". A radial glow behind the mockup adds visual depth.
3.  **Social Proof**: Horizontal stack showcasing platform logos with hover tooltips indicating platform status (active vs. upcoming).
4.  **Comparison**: Side-by-side grid comparing legacy SaaS (bad, soft-red glow) with native freedom (good, soft-green glow).
5.  **Personas**: Split card view targeting two core user demographics.
6.  **Features**: A grid of card elements displaying specific functional advantages.
7.  **How It Works**: High-contrast numbered list showing onboarding steps.
8.  **Pricing**: Standard tier card emphasizing the free local-first option.
9.  **FAQ**: Collapsible MUI Accordions to address structural queries.
10. **Footer (`LandingFooter`)**: Static column navigation links, legal copyright information, and social links.

---

## 5. SEO Metadata Specification

Below is the concrete Metadata specification mapped directly to the Next.js `Metadata` type. It utilizes the centralized brand constants where appropriate.

```typescript
import { Metadata } from 'next';
import { BRAND } from '@/lib/core/brand';

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

---

## 6. Structured Data (JSON-LD) Specification

The landing page must inject a unified `@graph` JSON-LD payload to declare the website structure, business identity, and software specifications.

```html
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://directly-social.vercel.app/#organization",
          "name": "Directly Social",
          "url": "https://directly-social.vercel.app",
          "logo": {
            "@type": "ImageObject",
            "@id": "https://directly-social.vercel.app/#logo",
            "url": "https://directly-social.vercel.app/logo.png",
            "caption": "Directly Social Logo"
          },
          "sameAs": [
            "https://github.com/thoufeeque22/directly.social",
            "https://x.com/directlysocial",
            "https://discord.gg/directly"
          ]
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://directly-social.vercel.app/#software",
          "name": "Directly Social",
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
            "@id": "https://directly-social.vercel.app/#organization"
          }
        },
        {
          "@type": "WebSite",
          "@id": "https://directly-social.vercel.app/#website",
          "url": "https://directly-social.vercel.app",
          "name": "Directly Social",
          "description": "The Native Social Client",
          "publisher": {
            "@id": "https://directly-social.vercel.app/#organization"
          }
        }
      ]
    })
  }}
/>
```

### Integration Guidelines for Discovery Phase:
*   Place the script directly within `src/app/page.tsx` inside the non-authenticated return block.
*   Ensure all values (URLs, shortNames, descriptions) strictly pull from `src/lib/core/brand.ts` or `src/lib/core/product-data.ts` to maintain a single source of truth.

