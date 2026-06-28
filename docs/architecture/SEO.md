# SEO Architecture

This document outlines the technical SEO implementation for the application.

## Core Implementations

### 1. Dynamic Sitemap (`sitemap.xml`)
- Powered by `src/app/sitemap.ts`.
- It dynamically generates the XML sitemap using Next.js Metadata Route APIs.
- Defined routes currently include: `/`, `/docs`, `/philosophy`, `/privacy`, `/terms`.
- Whenever new dynamic pages (e.g., blog posts or specific docs) are added, this file should be updated to query the database or CMS and yield a list of canonical URLs.

### 2. Robots (`robots.txt`)
- Powered by `src/app/robots.ts`.
- Allows indexing of all public routes while explicitly disallowing private routes such as `/admin`, `/api`, `/media`, `/settings`, and `/schedule`.

### 3. Canonical URLs and OpenGraph Data
- Implemented natively through Next.js `metadata` exports in `page.tsx` handlers for server-rendered routes.
- Ensures search engines treat the primary URL as the canonical source.
- Included `openGraph` and `twitter` tags for richer social sharing previews, utilizing dynamic values from the application's core brand configuration (`src/lib/core/brand.ts`).

### 4. Structured Data (JSON-LD)
- The `<Breadcrumbs />` component (`src/components/ui/Breadcrumbs.tsx`) handles navigation tracking visually.
- It dynamically generates and injects a `BreadcrumbList` JSON-LD schema into the `<head>` of the DOM using a standard `<script type="application/ld+json">` tag.
- This provides context to search engines about the page hierarchy.

## Future Recommendations
- When implementing a public-facing blog or user profile pages, integrate the dynamic slug logic into `src/app/sitemap.ts`.
- Extend the JSON-LD schemas beyond `BreadcrumbList` (e.g., `Article`, `FAQPage`, `SoftwareApplication`) where relevant.
