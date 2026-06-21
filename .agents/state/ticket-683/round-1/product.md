
## [2026-06-21 13:16:01] Verdict: APPROVED
---
- **Verdict**: APPROVED
- **UX Strategy**:
  - **Overview**: The System Status Dashboard page provides real-time transparency and visibility into the availability and response health of Directly Social's internal platform services and critical third-party integrations (TikTok, Meta Graph, YouTube Data APIs).
  - **Data Refresh Protocol**:
    - The client UI initiates automatic client-side polling every 60 seconds.
    - A visual "Last Updated" text label shows the exact localized time of the last update.
    - An interactive manual "Refresh" button (styled with `Button` component from MUI, using `RefreshIcon`) allows users to fetch the latest status on-demand without reloading the page.
    - Fetch states are represented with a linear progress bar (`LinearProgress`) or localized skeleton elements during retrieval to avoid layout shifts (CLS reduction).
    - API errors (e.g., fetch failure, network disconnected) are caught gracefully and communicated via a prominent MUI `Alert` component with a `severity="error"` status.
  - **Accessibility (A11y)**:
    - **Color Independence**: Status transitions must not be indicated by color alone. Every status icon is accompanied by explicit text labels (e.g., "Operational", "Degraded Performance", "Service Outage", "Under Maintenance").
    - **Screen Reader Announcements**: The main header uses `aria-live="polite"` or `aria-atomic="true"` to announce status changes dynamically to assistive technologies.
    - **Contrast Ratios**: All colored status text and background panels satisfy WCAG AA or AAA compliance (e.g., standard green for success is styled using theme-aware semantic tokens like `success.main` / `success.contrastText` or `theme.palette.success.dark` rather than hardcoded bright green).
    - **Keyboard Navigation**: The manual refresh button is fully focusable with visible focus indicators and triggers on `Enter` / `Space`.
    - **Semantic HTML**: Built using semantic layout tags (`Container`, `Box component="main"`, `Box component="section"`, headings `h1`, `h2`, `h3`).
  - **Zero-Emoji Compliance**:
    - Emojis are strictly prohibited in the user-facing UI. All visual status states are represented by semantic Material UI (MUI) icons rather than emoji characters.
  - **Interactive States**:
    - Component Cards support focus and hover triggers (e.g., subtle card elevation increase on hover).
    - High-visibility tooltips are attached to external API status cards explaining the integration scope (e.g., "Meta Graph API health for account connections and posting").
- **Industry Standards**:
  - **Competitive Benchmarks**:
    - Modern status pages (BetterStack, GitHub Status, Slack Status) rely on several key components:
      1. **Primary Status Banner**: A hero banner highlighting the overall global state of all systems at the top of the dashboard.
      2. **Grouped Service Statuses**: Separating core platforms (Web App, Database, API, Job Worker queues) from third-party downstream APIs. This prevents downstream API issues (like a minor Meta API rate-limiting anomaly) from misleading users into thinking the core Directly Social app is offline.
      3. **Historical Uptime Timeline**: Showing daily status grids or 90-day progress graphs, offering long-term transparency and credibility.
      4. **Maintenance announcements**: Forward-looking notices highlighting planned downtime.
      5. **Incident logs**: Reverse-chronological reports of resolved and ongoing incidents.
- **UI Layout**:
  - **Responsiveness & Layout Structure**:
    - Wrapped inside a responsive `Container` with `maxWidth="lg"`.
    - Stretches dynamically from mobile viewport (`xs: 12`) to desktop sizes (`md: 8`, `md: 4` split layout).
  - **Desktop Grid Details**:
    - **Top Row (Hero Banner)**: Spans all 12 columns. A prominent MUI `Card` or `Alert` styled with low-opacity background according to the global status:
      - Overall Healthy: `success.light` background, `CheckCircleIcon` in `success.main`, large title "All Systems Operational".
      - Minor Degraded: `warning.light` background, `WarningIcon` in `warning.main`, title "Degraded Performance".
      - Major Outage: `error.light` background, `ErrorIcon` in `error.main`, title "System Outage".
    - **Middle Row (Split Grid)**:
      - **Left Column (8 Columns - Component List)**: Grouped into distinct MUI `Paper` or `Card` panels:
        - **Core Platform Services**:
          - Web Application (`CheckCircleIcon`, Green)
          - Core API Gateway (`CheckCircleIcon`, Green)
          - Background Job Scheduler (`CheckCircleIcon`, Green)
          - Neon Database (`CheckCircleIcon`, Green)
        - **External Integration APIs**:
          - TikTok Publishing API (`CheckCircleIcon` or `WarningIcon` depending on status)
          - Meta Graph API (`CheckCircleIcon` or `WarningIcon`)
          - YouTube Data API (`CheckCircleIcon` or `WarningIcon`)
      - **Right Column (4 Columns - Statistics & Context)**:
        - **Historical Performance Panel**: Compact metrics displaying 90-day average uptime (e.g., 99.97%).
        - **Upcoming Maintenance Panel**: Showing announcements for scheduled downtime or service improvements.
    - **Bottom Row (12 Columns - Incidents Log)**:
      - Timeline or Accordion list showing past incidents, sorted by date.
  - **Mobile Layout Details**:
    - Split grid collapses into a single-column stack.
    - Component status items stack vertically. Text typography sizes dynamically resize (e.g., Dashboard title scales from `h3` on desktop to `h5` on mobile) using MUI's responsive breakpoints (e.g., `variant={{ xs: 'h5', md: 'h3' }}`).
  - **Colors & Icons**:
    - Healthy / Operational: `theme.palette.success.main` with `CheckCircleIcon`.
    - Degraded Performance: `theme.palette.warning.main` with `WarningIcon`.
    - Critical Outage: `theme.palette.error.main` with `ErrorIcon`.
    - Under Maintenance: `theme.palette.info.main` with `BuildIcon` (or `InfoIcon`).
  - **Footer Link Placement**:
    - **Landing Page Footer**: Link labeled `"System Status"` added to `FOOTER_COLUMNS` under `"Company"` (replacing the placeholder `#` with `/status` in `src/components/landing/Footer/constants.ts`).
    - **App Global Footer**: Link labeled `"Status"` updated in the `"Resources"` column of `src/components/layout/Footer.tsx` (replacing `#` with `/status`).
    - **New Page Entry Point**: The dashboard will reside under `src/app/(public)/status/page.tsx`, inheriting public layout context and global styling.
---

