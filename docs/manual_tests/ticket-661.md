# Manual Test Script: Ticket #661 - Sign-out Redirect to Landing Page

## Overview
- **Ticket ID**: #661
- **Goal**: Verify that users are redirected to the landing page (`/`) after signing out, and that a success notification is displayed.

## Prerequisites
1. User is logged in to the application.
2. User is on the dashboard or any authenticated page.

## Test Scenarios

### Scenario 1: Sign-out Redirection
1. **Action**: Click on the user profile menu (top right).
2. **Action**: Click the "Sign Out" button.
3. **Expected Result**: User is redirected to the root URL (`/`).
4. **Expected Result**: The URL should briefly show `/?loggedOut=true`.
5. **Expected Result**: A Snackbar notification with the message "Successfully signed out." appears at the bottom center of the page.

### Scenario 2: URL Cleanup
1. **Action**: Observe the URL after the sign-out redirection.
2. **Expected Result**: The `?loggedOut=true` query parameter should be automatically removed from the URL without a page refresh.
3. **Expected Result**: The browser history should be updated (using `replaceState`) so that navigating back does not re-trigger the notification.

### Scenario 3: Snackbar Dismissal
1. **Action**: Sign out to trigger the Snackbar.
2. **Action**: Wait for 5 seconds.
3. **Expected Result**: The Snackbar should automatically disappear.
4. **Action**: Sign out again (re-login and sign out).
5. **Action**: Click the close icon (X) on the Snackbar or click outside it.
6. **Expected Result**: The Snackbar should close immediately.

### Scenario 4: Landing Page Integrity
1. **Action**: Verify the content of the landing page after sign-out.
2. **Expected Result**: All 10 major sections (Hero, Features, Pricing, etc.) are visible.
3. **Expected Result**: No authentication-specific UI (like "Dashboard" link in header) is visible.

## Verdict
- [ ] PASS
- [ ] FAIL
