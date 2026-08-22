# Manual Test Script: Issue #702 - Comprehensive Account Settings Suite

## Prerequisites
- Local application running with database connected (`npm run dev`).
- Inngest development server running (`npx inngest-cli@latest dev`).
- Test user account available with `.env` configured for testing.

## Test Cases

### 1. Happy Path: Settings Navigation & URL Sync
**Objective:** Verify the left-rail navigation and `?tab=` query parameter synchronization.
1. Log in to the application and navigate to `/settings`.
2. Verify the layout consists of a left rail menu (3/12 width) and a main active panel (9/12 width).
3. Click on **Preferences** in the left rail. Verify the URL updates to `?tab=preferences`.
4. Click on **Privacy**. Verify URL updates to `?tab=privacy`.
5. Refresh the page on `?tab=privacy`. Verify the Privacy tab remains active.

### 2. Happy Path: Preferences Persistence
**Objective:** Verify updating `timezone` and notification toggles.
1. Navigate to Settings -> **Preferences**.
2. Change the Timezone and toggle "Email Notifications" & "In-App Notifications".
3. Click "Save Preferences" and verify the success toast.
4. Perform a hard reload (Ctrl+Shift+R / Cmd+Shift+R).
5. Verify the preferences retain the newly saved values.

### 3. Happy Path & Edge Case: Session Management
**Objective:** Verify "Log Out of All Devices" functionality.
1. Log in using a primary browser (e.g., Chrome).
2. Open an Incognito window or different browser and log in with the same credentials.
3. In the primary browser, navigate to Settings -> **Security**.
4. Click "Log Out of All Devices". Verify a success toast appears.
5. Verify the primary browser remains logged in and fully functional.
6. Switch to the secondary browser/Incognito window and attempt to navigate or refresh. Verify the session is terminated and user is redirected to the login page.
7. *Edge Case Simulation*: Mock `supabase.auth.signOut` failure; verify a graceful error toast appears instead of a 500 crash.

### 4. Happy Path & Rate Limiting: Data Portability (Export)
**Objective:** Verify Data Export triggers correctly and prevents abuse.
1. Navigate to Settings -> **Privacy**.
2. Click "Export Data". Verify a success toast: "Data export started".
3. Immediately click "Export Data" again multiple times. Verify a rate-limiting message appears.
4. Check the Inngest Dev UI to confirm the `user.data.export.requested` event fired successfully.
5. Verify an email with a mock download link was logged (if using Resend dev mode).

### 5. Edge Case: Upsert Logic for Migrated Users
**Objective:** Verify migrated users without `UserPreference` records can save preferences.
1. In the database, delete the `UserPreference` record for your test user.
2. In the UI, navigate to Settings -> **Preferences**.
3. Toggle a notification setting and click "Save".
4. Verify the operation succeeds (no 500 error) and a new `UserPreference` record is created (upsert works).

### 6. Negative Path: Unauthorized Export API
**Objective:** Prevent unauthorized data exports.
1. Log out of the application.
2. Use an API client (e.g., Postman) to send a POST request to `/api/export-user-data`.
3. Verify the server responds with a 401 Unauthorized or 403 Forbidden status code.
