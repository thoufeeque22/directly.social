# Manual Test Script: Status Page & Personalized Alerts

## Overview
Verify that the System Status Dashboard correctly fetches and displays the health of core services and external APIs. Crucially, verify that the external API list is dynamically filtered based on the user's connected social platforms (YouTube, TikTok, Meta) and that a warning icon appears in the sidebar if any connected platform is degraded.

## Setup
1. Ensure the development server is running locally (`npm run dev`).
2. Have test accounts prepared with different combinations of connected platforms (e.g., an account with only YouTube connected, and an account with TikTok connected).
3. Obtain a valid `BETTERSTACK_API_KEY` in your `.env` file to fetch real data, OR ensure `NEXT_PUBLIC_E2E=true` is set to force mock data.

---

## Test Scenarios

### 1. Unauthenticated Guest Access
- **Steps**:
    1. Open an Incognito window and navigate to the landing page `/`.
    2. Scroll to the footer and click "System Status".
- **Expected Result**:
    - The user is navigated to `/status`.
    - The Status Dashboard loads successfully without authentication.
    - ALL external platforms (YouTube, Meta, TikTok) are visible in the Service List because guests do not have personalized filters.

### 2. Authenticated Filtering (No Connected Accounts)
- **Steps**:
    1. Log in as a user with NO connected social media accounts.
    2. Navigate to the Status Page via the Sidebar.
- **Expected Result**:
    - The Sidebar "System Status" link does NOT have a red warning icon (since there are no connected accounts to be degraded).
    - The Service List on the Status page displays the "Directly Social App Functionality" section.
    - The external platform connections (YouTube, Meta, TikTok) are HIDDEN because the user has not connected them.

### 3. Authenticated Filtering (Specific Connected Accounts)
- **Steps**:
    1. Log in as a user with ONLY YouTube connected.
    2. Navigate to `/status`.
- **Expected Result**:
    - The Service List displays the core application services.
    - Under external integrations, ONLY "YouTube Connection" is visible. TikTok and Meta are hidden.

### 4. Dynamic Sidebar Alerts (Mocked Outage)
- **Steps**:
    1. Log in as a user with TikTok connected.
    2. Use a network interception tool (like Requestly) or modify `src/app/api/status/personalized/route.ts` temporarily to force `hasAlert: true`.
    3. Reload the dashboard (`/`).
- **Expected Result**:
    - The "System Status" link in the Sidebar automatically renders a red `<WarningAmberIcon />`.
    - Clicking the link takes the user to the status page where the degraded service is highlighted.

### 5. UI Interactivity & Tooltips
- **Steps**:
    1. On the Status Page, click the "Directly Social App Functionality" accordion header.
    2. Hover over the "Status" chips (e.g., "Operational", "Degraded").
- **Expected Result**:
    - The accordion collapses and expands smoothly.
    - Hovering over a status chip displays a tooltip explaining what that API governs (e.g., "Video publishing and analytics", with no highly technical internal jargon).

---

## Verdict Check
- [ ] Guest access shows all platforms?
- [ ] Authenticated access correctly hides unconnected platforms?
- [ ] Sidebar warning icon renders when an alert is active?
- [ ] Accordions and tooltips function correctly without hydration errors?
