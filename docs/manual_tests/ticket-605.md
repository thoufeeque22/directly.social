# Ticket 605: Manual Test Script

## Feature: Integrate @GoogleChrome/modern-web-guidance extension

### Prerequisite
1. Checkout branch `feature/605-modern-web-guidance` or `main` (if merged).
2. Ensure you have the `gemini` CLI installed.
3. Install dependencies: `npm install`.

### Test 1: Verify Extension Installation
**Steps:**
1. Open a terminal in the project root.
2. Run the command: `gemini extensions list`
**Expected Result:**
- The output should include `✓ modern-web-guidance` and show that it is enabled for the workspace.

### Test 2: Local Application Stability & Performance Audit
**Steps:**
1. Start the local development server: `npm run dev`
2. Navigate to the application in your browser (e.g., `http://localhost:3000`).
3. Open Chrome DevTools and navigate to the "Lighthouse" tab.
4. Run a performance audit on key pages (e.g., Dashboard, Settings).
**Expected Result:**
- The application should load without React 19 hydration mismatches or new console warnings.
- Lighthouse / Web Vitals metrics should report improvements or stable baselines compared to `main`.

### Test 3: Automated Tests and Next.js 15 Compatibility
**Steps:**
1. Run standard Playwright tests: `npm run test` or `npx playwright test`.
2. Run visual tests if configured (e.g. `npm run test:visual`).
3. Run the linting: `npm run lint`.
4. Run the build: `npm run build`.
**Expected Result:**
- All tests should pass without regressions.
- No new console warnings related to React Server Components (RSC) or hydration should appear.
- Build and linting should succeed.