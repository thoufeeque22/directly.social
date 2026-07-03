# System Status Dashboard

## Overview
The System Status dashboard provides real-time and near-real-time visibility into the operational health of core platform services and external integration APIs. 
- **Target Audience**: End-users, developer integrators, and support staff needing to check if service outages or API degradation are affecting their publishing or background job tasks.
- **Aesthetic**: Follows the brand guidelines with zero emojis, leveraging semantic Material UI (MUI) icons and theme-aware colors.

## Architecture
The system status feature is modularized to comply with the 100-line limit:
1. **Schema & Types** (`src/lib/schemas/status.ts`): Declares Zod schemas and TypeScript types for the BetterStack monitor API payload.
2. **API Routes**:
   - `src/app/api/status/route.ts`: Fetches live monitors and incidents from BetterStack's REST API. Crucially, it dynamically filters external API platforms (TikTok, Meta, YouTube) based on the authenticated user's connected social media accounts queried via Prisma.
   - `src/app/api/status/personalized/route.ts`: A lightweight endpoint polled every 5 minutes by the frontend sidebar to display a dynamic warning alert icon if any of the user's specifically connected services are degraded.
3. **Page Route** (`src/app/(public)/status/page.tsx`): Next.js public route that renders the dashboard.
4. **Dashboard Coordinator** (`src/components/status/StatusDashboard.tsx`): Coordinates fetching, loading, errors, 60s automatic polling, and hydration-safe last-updated timestamps.
5. **Sub-components**:
   - `StatusHero`: Theme-aware header card displaying aggregated system status.
   - `ServiceList`: Grouped list of core and external services with keyboard-accessible tooltips.
   - `SidebarPanels`: Shows 90-day average uptime and upcoming maintenance events.
   - `IncidentsTimeline`: Reverse-chronological past incident accordion logs.

## Configuration
The feature relies on the following environment variables:
- `BETTERSTACK_API_KEY`: BetterStack API token.
- `NEXT_PUBLIC_APP_URL`: Used for constructing dynamic references.
- `NEXT_PUBLIC_E2E`: When set to `true`, the status API routes bypass Prisma database calls and fallback to predefined mock connected accounts (Google, Facebook, TikTok) for reliable Playwright UI testing.
Other settings such as brand and contact support are fetched dynamically from central files (`src/lib/core/brand.ts` and `src/lib/core/emails.ts`).

## E2E Testing & Mocks
For local development, testing, and E2E validation, the application relies on Playwright network interceptions (`page.route`) instead of backend query parameters. 

The E2E tests dynamically intercept the calls to `/api/status` and `/api/status/personalized` to inject arbitrary health scenarios purely at the browser layer:
- `all-healthy`: Default API response.
- `degraded-performance`: Injects a degraded status for specific APIs.
- `major-outage`: Injects a down status.
- `maintenance`: Simulates a scheduled maintenance window.
- `error`: Simulates a backend 500 failure to test error boundary alert components.

## Access Pathways
Users can access the dashboard through the following integration links:
1. **Landing Page Footer**: Accessible at the bottom of the landing layout for unauthenticated guests.
2. **Sidebar Navigation**: Placed within the main authenticated dashboard sidebar. This link automatically displays a dynamic red warning icon (`<WarningAmberIcon />`) if the personalized polling endpoint detects an outage for the user's specific connected accounts.
