# Manual Test: Global UI/UX Audit (Premium Glass Aesthetic)

**Issue**: #541
**Objective**: Verify that the application-wide UI aligns with the new Dashboard premium "Glass Aesthetic" (specifically the Settings and History pages) and that interactive elements maintain high usability and accessibility.

## Prerequisites
1. Ensure the application is running locally (`npm run dev`) or deployed to a staging environment.
2. Ensure you have an active user session (log in using `tester@socialstudio.ai` or your own account).

## Test Cases

### 1. Settings Page UI (`/settings`)
**Steps:**
1. Navigate to `/settings` from the sidebar menu.
2. Observe the main content container.
**Expected Results:**
- The background of the content area should feature a translucent "glass" effect (GlassCard styling).
- Icons should use the standard Material UI semantic colors (e.g., primary, error, textSecondary).
- Form inputs, switches, and buttons should be aligned with appropriate padding and spacing, matching the Dashboard's look and feel.

### 2. Bring Your Own Key (BYOK) Settings (`/settings/byok`)
**Steps:**
1. Navigate to `/settings/byok` via the navigation menu.
2. Observe the layout of the connected platform cards (YouTube, Instagram, etc.).
**Expected Results:**
- The BYOK configuration section should be wrapped in the premium GlassCard layout.
- Individual platform cards should have a cohesive design without legacy hardcoded background colors.
- Interactive elements (Connect/Disconnect buttons) should have clear hover states.

### 3. History Page UI (`/history`)
**Steps:**
1. Navigate to `/history` via the sidebar menu.
2. Observe the search/filter controls at the top and the timeline list below.
**Expected Results:**
- The main wrapper for the history content should feature the translucent "glass" design.
- The Status pills (e.g., "Published", "Failed", "Pending") should use proper Material UI variables rather than hardcoded string colors.
- Platform icons inside the timeline should inherit colors from the MUI theme (e.g., YouTube in `error.main` red).

### 4. Responsiveness and A11y
**Steps:**
1. Open any of the updated views (`/settings`, `/history`).
2. Shrink the browser window to mobile width.
3. Use the `Tab` key to navigate through the interactive elements.
**Expected Results:**
- The GlassCard containers should adjust their padding and margins gracefully on smaller screens.
- All form fields, switches, and buttons should be reachable via keyboard navigation and show visible focus outlines.
