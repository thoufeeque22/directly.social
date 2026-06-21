
## [2026-06-21 13:21:15] Verdict: APPROVED
---
- **Verdict**: APPROVED
- **Socratic Log**:
  - **Mocking vs. Live API Strategy**:
    - *Question*: How do we reconcile the requirement for "real-time or near-real-time visibility from BetterStack API" with the lack of credentials/keys in development/CI/E2E environments?
    - *Resolution*: The Next.js Route Handler `/api/status` will perform a hybrid check logic. If a `BETTERSTACK_API_KEY` is defined in the environment variables, it attempts to fetch the monitors from BetterStack's REST API `/api/v2/monitors`. If that environment variable is absent, or if the API call fails or times out, it seamlessly falls back to programmatically generated mock data representing the 4 core services and 3 external APIs. This ensures high robustness, ease of local development, and zero-config deployment.
  - **State Simulation for E2E Testing**:
    - *Question*: How can Playwright automate testing for different statuses (operational, degraded, outage, maintenance) without modifying static environment variables during the run?
    - *Resolution*: The Route Handler `/api/status` will accept a query parameter `scenario`. In our tests, Playwright will load the status page with `?scenario=degraded-performance` or `?scenario=major-outage`, and the frontend status page will pass this parameter through to the `/api/status` API call. This allows mock responses to be dynamically customized on-demand by the test runner without complex network interception or mock servers.
  - **MUI Theme Integration & Design Tokens**:
    - *Question*: How to ensure a consistent, theme-aware palette (light and dark mode compatibility) without hardcoding HSL or hex colors?
    - *Resolution*: Utilize MUI's standard system typography and palette tokens via the `sx` prop (e.g., `success.main`, `warning.main`, `error.main`, `info.main`). For backgrounds of cards, use lightweight color variants like `success.light` or `error.light`. This ensures that light-mode contrast is high and dark-mode maintains its premium dark aesthetic.
  - **Hydration Warning Mitigation (Client-Side Polling vs Server Rendering)**:
    - *Question*: How to avoid Next.js hydration mismatches for dynamic date/time labels (e.g. "Last Updated: 11:15 AM")?
    - *Resolution*: The "Last Updated" timestamp uses client-side locale formatting. To avoid hydration errors, the state is initialized to an empty string `""` and updated strictly inside a `useEffect` hook after mount.
  - **Modularity Enforcement (100-Line Rule)**:
    - *Question*: The project strictly enforces a 100-line limit for all new source code files. How do we build a full-featured dashboard under this constraint?
    - *Resolution*: Decompose the System Status dashboard into high-cohesion sub-components:
      - `StatusDashboard`: The main layout shell coordinating fetch state and automatic 60s polling.
      - `StatusHero`: The global banner displaying the aggregated system state.
      - `ServiceList`: Split lists of core and external services with tooltip explanations.
      - `SidebarPanels`: Performance uptime metrics (e.g., 99.97%) and upcoming maintenance list.
      - `IncidentsTimeline`: Reverse-chronological past incident accordion logs.
      - `src/app/(public)/status/page.tsx`: Page route export.
      - `src/lib/schemas/status.ts`: Zod schema and TypeScript types.
      This ensures all files are extremely simple, readable, and strictly <= 100 lines.
  - **Zero-Emoji Compliance**:
    - *Question*: How do we strictly comply with the BRAND UI/UX standard's "No Emojis" policy while keeping the dashboard visual and intuitive?
    - *Resolution*: Emojis (like 🟢, 🟡, 🔴) are completely excluded from both the code and user-facing copy. Instead, we use semantic MUI icons (`CheckCircleIcon`, `WarningIcon`, `ErrorIcon`, `BuildIcon`, `RefreshIcon`) and styled badge chips.

- **Technical Blueprint**:
  - **File List & Paths**:
    - **Schema & Types**: `src/lib/schemas/status.ts`
    - **API Route**: `src/app/api/status/route.ts`
    - **Page Route**: `src/app/(public)/status/page.tsx`
    - **Main Component**: `src/components/status/StatusDashboard.tsx`
    - **Hero Banner Component**: `src/components/status/StatusHero.tsx`
    - **Services List Component**: `src/components/status/ServiceList.tsx`
    - **Sidebar Panels Component**: `src/components/status/SidebarPanels.tsx`
    - **Timeline Component**: `src/components/status/IncidentsTimeline.tsx`
    - **Footer Mod**: `src/components/landing/Footer/constants.ts` (replace `#` with `/status`)
    - **Footer Component Mod**: `src/components/layout/Footer.tsx` (replace `#` with `/status`)
    - **E2E Test File**: `src/__tests__/e2e/status-dashboard.spec.ts`

  - **API Route Design (`src/app/api/status/route.ts`)**:
    - **Method**: `GET`
    - **Authentication**: Public endpoint (unauthenticated).
    - **Caching**: Revalidate every 30 seconds for live BetterStack requests.
    - **Parameters**: `scenario` query parameter (`all-healthy` | `degraded-performance` | `major-outage` | `maintenance` | `error`).
    - **Fallback**: Gracefully falls back to mock responses if `BETTERSTACK_API_KEY` is not present.

  - **Schema/Types Definition (`src/lib/schemas/status.ts`)**:
    ```typescript
    import { z } from '@/lib/api/zod-openapi';

    export const BetterStackMonitorStatusSchema = z.enum([
      'up',
      'down',
      'degraded',
      'maintenance',
      'paused',
    ]);

    export const BetterStackMonitorAttributesSchema = z.object({
      name: z.string(),
      url: z.string().optional(),
      monitor_type: z.string().optional(),
      status: BetterStackMonitorStatusSchema,
      last_checked_at: z.string(),
      uptime_percentage: z.number(),
    });

    export const BetterStackMonitorSchema = z.object({
      id: z.string(),
      type: z.literal('monitor'),
      attributes: BetterStackMonitorAttributesSchema,
    });

    export const BetterStackResponseSchema = z.object({
      data: z.array(BetterStackMonitorSchema),
    });

    export type BetterStackMonitorStatus = z.infer<typeof BetterStackMonitorStatusSchema>;
    export type BetterStackMonitor = z.infer<typeof BetterStackMonitorSchema>;
    export type BetterStackResponse = z.infer<typeof BetterStackResponseSchema>;
    ```

  - **Mock Strategy Details**:
    - **Core Platform Services**: Grouped under IDs `1`-`4` (Web Application, Core API Gateway, Background Job Scheduler, Neon Database).
    - **External Integration APIs**: Grouped under IDs `5`-`7` (TikTok Publishing API, Meta Graph API, YouTube Data API).
    - **Scenario Definitions**:
      - `all-healthy` (default): All 7 monitors set to status `'up'`.
      - `degraded-performance`: TikTok (`5`) and Meta (`6`) monitors set to status `'degraded'`.
      - `major-outage`: Core API Gateway (`2`), Background Job Scheduler (`3`), and Meta (`6`) set to status `'down'`.
      - `maintenance`: Background Job Scheduler (`3`) and Neon Database (`4`) set to status `'maintenance'`.
      - `error`: Triggers a 500 response error helper.

  - **MUI Theme Integration Patterns**:
    - **Containers & Layout**: Wrap everything in `<Container maxWidth="lg">` and standard responsive grid `<Grid container spacing={4}>`.
    - **Color Tokens**:
      - operational/up: `theme.palette.success.main` with `<CheckCircleIcon />`
      - degraded: `theme.palette.warning.main` with `<WarningIcon />`
      - outage/down: `theme.palette.error.main` with `<ErrorIcon />`
      - maintenance: `theme.palette.info.main` with `<BuildIcon />`
      - paused: `theme.palette.text.secondary` with `<InfoIcon />`
    - **Alert backgrounds**: Use `bgcolor: 'success.light'` / `color: 'success.dark'` / `borderColor: 'success.main'` for hero status alert panels to automatically map to dark/light variants of the active palette.

- **Test Specification**:
  - **Playwright E2E Automation (`src/__tests__/e2e/status-dashboard.spec.ts`)**:
    - **Test 1: Footer Navigation**:
      1. Navigate to `/`.
      2. Click on the "System Status" link in the landing page footer.
      3. Verify navigation to `/status`.
      4. Navigate to dashboard settings page (authenticated user).
      5. Click on "Status" link in the global app footer.
      6. Verify navigation to `/status`.
    - **Test 2: Page Integration**:
      1. Navigate to `/status`.
      2. Assert the "System Status" title heading is visible.
      3. Assert the manual "Refresh" button exists and is clickable.
      4. Check that the "Last Updated" timestamp updates on button click.
    - **Test 3: State Simulations**:
      1. Navigate to `/status?scenario=degraded-performance` and assert that the hero banner shows "Degraded Performance" with a warning background and `WarningIcon`.
      2. Navigate to `/status?scenario=major-outage` and assert that the hero banner shows "System Outage" with an error background and `ErrorIcon`.
      3. Navigate to `/status?scenario=maintenance` and assert that the hero banner shows "Scheduled Maintenance" with an info background and `BuildIcon`.
      4. Navigate to `/status?scenario=error` and assert that a MUI `<Alert severity="error">` is displayed.

  - **Manual Test Cases**:
    - **Case 1: Responsive Grid Wrapping**:
      1. Open the page `/status` in Chrome DevTools.
      2. Set viewport to mobile width (375px). Verify the layout stacks vertically into a single column.
      3. Set viewport to tablet width (768px). Verify the layout is readable and components stack cleanly.
      4. Set viewport to desktop width (1200px). Verify split layout: 8-column main list on the left, 4-column sidebar on the right.
    - **Case 2: Theme Switching**:
      1. Open `/status`.
      2. Toggle theme mode (dark mode to light mode).
      3. Verify card background colors, borders, text, and status icons dynamically adjust, keeping WCAG AA/AAA color contrast ratios compliant.
    - **Case 3: A11y Verification**:
      1. Navigate the `/status` page using the `Tab` key.
      2. Confirm the manual refresh button receives a visible focus outline.
      3. Trigger the refresh button using `Enter` and `Space`.
      4. Inspect the title to verify `aria-live="polite"` and `aria-atomic="true"` properties exist.
      5. Hover or focus on external API tooltips to ensure help messages appear dynamically.
---

