# Manual Test Script: User Server Actions Modularization (Ticket #672)

## Overview
Verify the functional workflows, state persistence, and error handling of user accounts, preferences, and system settings after decomposing the server actions inside `src/app/actions/user.ts` into modular, domain-specific server actions under `src/app/actions/user/` (`accounts.ts`, `preferences.ts`, and `settings.ts`).

## Prerequisites
1. Run the local development server: `npm run dev`.
2. Open the browser and navigate to `http://localhost:3000`.
3. Log in with a standard test user account.
4. Prepare standard connected accounts in the mock DB or seed script (YouTube, TikTok, Facebook).

---

## Test Scenarios

### Scenario 1: Social Accounts Integration (accounts.ts)
1. **Fetch & Render Accounts**:
   - Navigate to the **Settings** page or **Dashboard**.
   - **Expected Result:** The application successfully calls `getUserAccounts` and renders all connected social accounts (e.g. YouTube, TikTok, Facebook) with their correct profiles.
2. **Toggle Account Distribution**:
   - Locate the distribution checkbox next to a connected account (e.g., TikTok).
   - Click to toggle the checkbox.
   - **Expected Result:**
     - The checkbox state changes optimistically.
     - An API call to `toggleAccountDistribution` is executed.
     - On page reload, the state is persisted.
3. **Disconnect Account**:
   - Click the **Disconnect** (or delete) button next to a connected account.
   - Confirm the operation when prompted.
   - **Expected Result:**
     - The account is removed optimistically from the list.
     - `disconnectAccount` is executed to delete the record in the database.
     - On page reload, the account does not reappear.

### Scenario 2: Platform Preferences Persistence (preferences.ts)
1. **Toggle Platform Configs**:
   - Navigate to **Settings** -> **Preferences** (or the respective platform config cards).
   - Toggle platform selection on/off (e.g., enable YouTube, disable Instagram).
   - **Expected Result:**
     - UI triggers `togglePlatformPreference`.
     - The database record updates successfully.
2. **Persistence Check**:
   - Hard refresh the page (`Cmd + Shift + R` or `Ctrl + F5`).
   - **Expected Result:**
     - The page queries `getPlatformPreferences` and renders the exact disabled/enabled states configured in the previous step.

### Scenario 3: AI Enhancement Styles & Model Providers Selection (preferences.ts)
1. **AI Style Preference**:
   - Select a different AI style option (e.g., switch from "Manual" to "Enrich").
   - **Expected Result:**
     - UI invokes `updateAIStylePreference`.
     - Reload the page; verify that `getAIStylePreference` returns the correct updated style.
2. **AI Provider Preference**:
   - Select a different AI model provider (e.g., switch from "OpenAI" to "Gemini").
   - **Expected Result:**
     - UI invokes `updateAIProviderPreference`.
     - Reload the page; verify that `getAIProviderPreference` returns the updated provider.
3. **AI Tone/Style Mode**:
   - Change the AI tone/style mode (e.g., select "Gen-Z" or "SEO").
   - **Expected Result:**
     - UI invokes `updateAIStyleModePreference`.
     - Reload the page; verify that `getAIStyleModePreference` returns the correct selected tone mode.

### Scenario 4: Sticky Video Format Preference (preferences.ts)
1. **Select Format**:
   - On the main dashboard, switch the video format toggle from "Short" to "Long".
   - **Expected Result:**
     - The UI changes and calls `updateVideoFormatPreference` to persist selection.
2. **Session Verification**:
   - Navigate away from the dashboard (e.g., go to the Media Library), then return to the dashboard. Or perform a hard refresh.
   - **Expected Result:**
     - The application queries `getVideoFormatPreference` and restores the "Long" video format selection by default.

### Scenario 5: Light/Dark Theme Preference Synchronization (settings.ts)
1. **Theme Toggle**:
   - Toggle the theme selector (e.g., switch from Light Mode to Dark Mode).
   - **Expected Result:**
     - The application immediately switches its theme variables.
     - `updateThemePreference` is called to save the theme preference in the database.
2. **Multi-session Persistence**:
   - Log out and log back in, or refresh the browser.
   - **Expected Result:**
     - The application reads `getThemePreference` during boot and mounts with Dark Mode already applied, preventing any light-flash flicker.
