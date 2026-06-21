# Manual Test Script: Ticket #488 - Technical SEO Foundation

This document provides step-by-step instructions for manual verification of the Technical SEO Foundation implementation.

---

## Test Scenarios

### 1. Landing Page Layout and MUI Theme Compliance
*   **Setup:** Ensure you are not logged in (clear all active sessions/cookies) and navigate to `http://localhost:3000/`.
*   **Action:**
    1.  Observe the page layout structure.
    2.  Toggle system preferences or the application UI between Light and Dark modes.
    3.  Scan the entire page for visual compliance.
*   **Verification:**
    1.  The landing page must display a clear header (`LandingHeader`), main feature body (`LandingPage`), and footer (`LandingFooter`).
    2.  No flash of unstyled content (FOUC) occurs.
    3.  All styles (typography, background colors, card borders, spacing) must align with the MUI theme and react appropriately to dark/light theme switching. No hardcoded color codes (like `#fff` or `#000`) should be used in local TSX styles; instead, they must rely on MUI theme tokens.
    4.  Verify that there are **no emojis** anywhere in the copy, headings, or buttons (strict No Emojis rule).

### 2. Dynamic Page Metadata (Head Tags)
*   **Setup:** Open the landing page at `http://localhost:3000/` as an unauthenticated guest.
*   **Action:** Right-click the page, select **View Page Source** (or open browser DevTools, inspect the `<head>` section).
*   **Verification:**
    *   Confirm the presence and exact content of the following elements:
        *   `<title>`: `Directly Social | The Native Social Media Creator Studio`
        *   `<meta name="description" content="...">`: `Publish native Short, Reel, and TikTok video formats directly using your own API keys. No middleware servers, no markups, complete data privacy, and Bring Your Own Storage (BYOS).`
        *   `<meta name="keywords" content="...">`: `social media manager, native social client, auto poster, tiktok scheduler, instagram reels scheduler, youtube shorts poster, privacy first social tool, bring your own keys, byos storage, short-form video distribution`
        *   `<link rel="canonical" href="...">`: `https://directly-social.vercel.app`
        *   `<meta name="robots" content="index,follow">`
    *   Confirm the OpenGraph tags:
        *   `<meta property="og:title" content="Directly Social - The Native Social Media Client">`
        *   `<meta property="og:description" content="Stop paying the SaaS tax. Publish native shorts, reels, and TikToks directly from your device using your own keys and cloud storage.">`
        *   `<meta property="og:url" content="https://directly-social.vercel.app">`
        *   `<meta property="og:site_name" content="Directly Social">`
        *   `<meta property="og:locale" content="en_US">`
        *   `<meta property="og:type" content="website">`
        *   `<meta property="og:image" content="https://directly-social.vercel.app/og-image.png">`
    *   Confirm the Twitter Card tags:
        *   `<meta name="twitter:card" content="summary_large_image">`
        *   `<meta name="twitter:title" content="Directly Social - The Native Social Media Client">`
        *   `<meta name="twitter:description" content="Publish native video content directly using your own API keys. No markups, no middleware database, and complete data privacy.">`
        *   `<meta name="twitter:image" content="https://directly-social.vercel.app/og-image.png">`
        *   `<meta name="twitter:creator" content="@directlysocial">`

### 3. Schema.org JSON-LD Graph
*   **Setup:** Open the landing page at `http://localhost:3000/` as an unauthenticated guest.
*   **Action:** In browser DevTools, locate the element `<script type="application/ld+json">` and copy its inner text.
*   **Verification:**
    1.  Validate that the JSON parses correctly and contains the `@context` set to `https://schema.org`.
    2.  Verify the `@graph` array contains exactly 3 objects:
        *   **`Organization`**:
            *   `@id`: `https://directly-social.vercel.app/#organization`
            *   `name`: `Directly Social`
            *   `url`: `https://directly-social.vercel.app`
            *   `logo`: `@id` is `https://directly-social.vercel.app/#logo` and `url` is `https://directly-social.vercel.app/logo.png`
            *   `sameAs`: MUST match official URLs:
                *   `https://github.com/thoufeeque22/directly.social`
                *   `https://x.com/directlysocial`
                *   `https://discord.gg/directly`
        *   **`SoftwareApplication`**:
            *   `@id`: `https://directly-social.vercel.app/#software`
            *   `name`: `Directly Social`
            *   `applicationCategory`: `BusinessApplication`
            *   `operatingSystem`: `Web, iOS, Android`
            *   `offers`: An `AggregateOffer` with a price of `0` USD and `offers[0]` named `"Local Core"`.
            *   `publisher`: References `{"@id": "https://directly-social.vercel.app/#organization"}`
        *   **`WebSite`**:
            *   `@id`: `https://directly-social.vercel.app/#website`
            *   `url`: `https://directly-social.vercel.app`
            *   `name`: `Directly Social`
            *   `description`: `The Native Social Client`
            *   `publisher`: References `{"@id": "https://directly-social.vercel.app/#organization"}`

### 4. Dynamic Browser Title Override (Authenticated)
*   **Setup:** Run the dev server and log in to the application.
*   **Action:**
    1.  Observe the browser tab title once logged in and redirected to the dashboard.
    2.  Inspect the raw page source using `curl -s http://localhost:3000/`.
*   **Verification:**
    1.  The browser tab title must dynamically override to `Dashboard | Directly Social`.
    2.  The raw, server-rendered source fetched via curl must *still* return `Directly Social | The Native Social Media Creator Studio` in the `<title>` tag (verifying hydration-safety: title override executes on client-side mount only and doesn't pollute the SSR output needed for crawlers).

---

## Results
*   **Verdict:** PASS
*   **Notes:** Fully automated E2E tests written in `src/__tests__/e2e/seo.spec.ts` cover title, metadata tags, OpenGraph/Twitter card tags, and JSON-LD schema parsing. All checks passed.
