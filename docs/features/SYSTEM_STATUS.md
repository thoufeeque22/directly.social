# System Status Dashboard

## Overview
The System Status dashboard provides real-time and near-real-time visibility into the operational health of core platform services and external integration APIs. 
- **Target Audience**: End-users, developer integrators, and support staff needing to check if service outages or API degradation are affecting their publishing or background job tasks.
- **Aesthetic**: Follows the brand guidelines with zero emojis, leveraging semantic Material UI (MUI) icons and theme-aware colors.

## Architecture
The system status feature is modularized to comply with the 100-line limit:
1. **Schema & Types** (`src/lib/schemas/status.ts`): Declares Zod schemas and TypeScript types for the BetterStack monitor API payload.
2. **API Route** (`src/app/api/status/route.ts`): Performs a hybrid check. If `BETTERSTACK_API_KEY` is present, it fetches live monitors from BetterStack's REST API. Otherwise, it falls back to mock responses.
3. **Page Route** (`src/app/(public)/status/page.tsx`): Next.js public route that receives scenario parameters and renders the dashboard.
4. **Dashboard Coordinator** (`src/components/status/StatusDashboard.tsx`): Coordinates fetching, loading, errors, 60s automatic polling, and hydration-safe last-updated timestamps.
5. **Sub-components**:
   - `StatusHero`: Theme-aware header card displaying aggregated system status.
   - `ServiceList`: Grouped list of core and external services with keyboard-accessible tooltips.
   - `SidebarPanels`: Shows 90-day average uptime and upcoming maintenance events.
   - `IncidentsTimeline`: Reverse-chronological past incident accordion logs.

## Configuration
The feature relies on the following environment variables:
- `BETTERSTACK_API_KEY`: BetterStack API token. If absent, the system falls back to a programmatic mock.
- `NEXT_PUBLIC_APP_URL`: Used for constructing dynamic references.
Other settings such as brand and contact support are fetched dynamically from central files (`src/lib/core/brand.ts` and `src/lib/core/emails.ts`).

## Uptime & Scenario Simulations
Monitors track uptime and compute status. For local development, testing, and E2E validation, the API route supports scenario simulations. Passing `?scenario=...` to the status page/endpoint forces specific health states:
- `all-healthy` (default): All core services and external APIs set to operational (`up`).
- `degraded-performance`: Sets TikTok and Meta Graph APIs to `degraded`.
- `major-outage`: Sets API Gateway, Scheduler, and Meta Graph API to `down`.
- `maintenance`: Sets Scheduler and Neon Database to `maintenance`.
- `error`: Simulates a backend 500 failure to test error boundary alert components.

## Access Pathways
Users can access the dashboard through the following integration links:
1. **Landing Page Footer**: Accessible at the bottom of the landing layout for unauthenticated guests.
2. **App Layout Footer**: Placed at the bottom of the primary workspace sidebar/footer for authenticated dashboard users.
