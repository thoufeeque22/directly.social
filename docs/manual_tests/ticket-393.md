# Manual Test Script: Ticket 393 - AI Studio Billing Check

## Prerequisites
- A local instance of the application is running (`npm run dev`).
- You have an active user session.
- You have access to the database (e.g., via `npx prisma studio`) to modify credits or verify them.

## Scenario 1: Happy Path (Standard User Generation)
**Goal:** Verify that a standard user with >0 credits correctly consumes credits and the UI updates synchronously.
1. **Pre-condition:** Open your database and ensure your test user has `aiCredits` > 0 (e.g., 100) and no active `byokConfigs` for the AI provider.
2. Navigate to the application dashboard.
3. Observe the "AI Credits" chip in the top right header. It should display your current balance (e.g., "100 Credits").
4. Click the floating chat button (FAB) to open the AI Chat window.
5. Type a prompt (e.g., "Write a social media post about automated testing") and click Send.
6. **Expected Result:**
   - The AI responds to your prompt.
   - The AI Credits chip in the header instantly updates to display the new balance (e.g., "99 Credits") without a page reload.
   - Verifying in the database, the `aiCredits` field is decremented by 1.

## Scenario 2: Edge Case (Low Credit Threshold Alert)
**Goal:** Verify that notifications are triggered when credits reach a low threshold.
1. **Pre-condition:** Manually set your user's `aiCredits` to `11`.
2. Refresh the application to ensure the UI displays "11 Credits".
3. Open the AI Chat and send a prompt.
4. **Expected Result:**
   - The AI responds.
   - The AI Credits chip updates to "10 Credits".
   - You receive an in-app `WARNING` notification stating: "Your AI credits are running low. You have 10 credits remaining."
   - Check the console logs of the running application for an output containing `EMAIL ALERT: User <ID> has hit the low AI credits threshold`.
   - Admin users also receive an in-app notification about your low credits.

## Scenario 3: Negative Scenario (Zero Credits)
**Goal:** Verify that the system blocks AI generation when the balance is 0.
1. **Pre-condition:** Manually set your user's `aiCredits` to `0`.
2. Refresh the application to ensure the UI displays "0 Credits".
3. Open the AI Chat and send a prompt.
4. **Expected Result:**
   - The chat immediately fails and displays an error message containing "Insufficient AI Credits".
   - Verifying in the database, the `aiCredits` field remains at `0`.
   - No cost is incurred externally.

## Scenario 4: Happy Path (BYOK User)
**Goal:** Verify that BYOK (Bring Your Own Key) users do not consume platform AI credits.
1. **Pre-condition:** Set your user's `aiCredits` to an arbitrary number (e.g., 50). Enable BYOK configuration in the database or via user settings (e.g., provide a valid `apiKey` for `openai`).
2. Navigate to the dashboard.
3. Open the AI Chat and send a prompt.
4. **Expected Result:**
   - The AI responds using your provided key.
   - The AI Credits chip remains unchanged.
   - Verifying in the database, the `aiCredits` field remains at `50`.

## Clean Up
- Reset `aiCredits` to the default value or your typical testing value.
- Re-enable or disable BYOK configurations as per your normal test environment state.
