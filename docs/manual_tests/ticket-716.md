# Manual Test Script for Ticket #716
**Regression: Mobile Navigation E2E Tests Time Out on Collapsed Sidebar**

## Goal
Verify that the mobile hamburger navigation toggle functions properly and can be utilized by automated testing without timeouts.

## Setup
1. Launch the application in a mobile viewport (e.g. Chrome DevTools device mode, set to iPhone 12 Pro).
2. Log in to the application as a standard tester.

## Test Cases

### Scenario 1: Navigate to Settings on Mobile
1. Start on the dashboard page (`/dashboard`).
2. Verify that the sidebar navigation links are not immediately visible.
3. Locate the Hamburger menu button (accessible via `page.getByLabel('Open navigation menu')` or equivalent).
4. Click the Hamburger menu button.
5. Verify that the navigation drawer opens.
6. Click the "Settings" link.
7. Verify successful navigation to the Settings page.

### Scenario 2: Navigate to BYOS (Storage) on Mobile
1. Start on the dashboard page (`/dashboard`).
2. Verify that the sidebar navigation links are not immediately visible.
3. Click the Hamburger menu button.
4. Verify that the navigation drawer opens.
5. Click the "Storage" link.
6. Verify successful navigation to the Storage page.

### Scenario 3: Navigate to Sign Out on Mobile
1. Start on the dashboard page (`/dashboard`).
2. Verify that the sidebar navigation links are not immediately visible.
3. Click the Hamburger menu button.
4. Verify that the navigation drawer opens.
5. Click the "Sign Out" link.
6. Verify successful log out and redirection.
