# Subdomain Routing

This document outlines the subdomain routing architecture for directly.social, implemented natively via Next.js 16 Middleware.

## Architecture Topology

The application uses a unified monolithic deployment (Vercel) but serves content based on the incoming hostname:

- **Marketing (`directly.social`)**: Serves the landing page and public marketing content from `src/app/marketing`.
- **App (`app.directly.social`)**: Serves the authenticated dashboard and application logic from `src/app/app`.
- **Staging (`staging.app.directly.social`)**: Functions identically to the App subdomain but is used for the long-lived staging environment.

## Middleware (`src/proxy.ts`)

The routing is entirely handled in `src/proxy.ts` (named proxy.ts as Next.js 16 deprecated `middleware.ts` in our configuration).

### Key Responsibilities:
1. **Rate Limiting**: Checks Upstash Redis rate limits. Extracted to `src/lib/core/rate-limit-middleware.ts`.
2. **Subdomain Detection**: Parses `req.headers.get("host")` to determine if the user is on the `app.` subdomain.
3. **Vercel Preview Deployments**: Automatically detects `*.vercel.app` branches. Previews default to the App domain, but can view the marketing site by appending `?site=marketing` to the URL.
4. **URL Rewriting**: Rewrites (does not redirect) the request to the correct Next.js folder (`/marketing` or `/app`) invisibly to the user.
5. **Cross-Domain CTA Routing**: Ensures that navigating to `/signup` on the marketing site automatically redirects to `https://app.directly.social/login`.

## Authentication & Cookies

To ensure users remain logged in across subdomains, the session cookie is configured with `domain=.directly.social`. This allows the marketing site and the app site to read the same NextAuth session.

## Testing

Routing logic is validated via Playwright E2E tests (`src/__tests__/e2e/routing-subdomains.spec.ts`), which mock the `host` headers to ensure rewrites behave correctly without needing actual DNS changes locally.
