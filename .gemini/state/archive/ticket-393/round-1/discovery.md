**VERDICT:** NECESSARY

**SOCRATIC_LOG:**
*   **Feasibility:** Highly feasible. The Prisma schema easily accommodates a new `aiCredits` integer field on the `User` model. The logic to decrement this balance can be seamlessly integrated into the existing AI generation routes (`src/app/api/chat/route.ts` and `src/app/actions/ai.ts`). 
*   **Strategic Alignment:** Cost control and abuse prevention are critical given that the platform's API keys (Gemini/OpenAI) incur usage costs.
*   **Architectural Integrity:** The credit logic cleanly falls into a utility (`src/lib/core/credits.ts`). BYOK (Bring Your Own Key) users correctly bypass the credit deduction. The existing `Notification` model handles both the user alerts and admin notifications without introducing complex external vendors. To strictly fulfill the "email" alert requirement without prematurely inflating `package.json` dependencies, a mock email dispatcher via `logger.info` is structurally sound.
*   **Necessity/Priority:** Explicitly requested in the ticket constraints and necessary for scale.
*   **External Dependencies & Cost:** None required. We will use the existing Prisma backend and NextAuth infrastructure.

**TECHNICAL SPECS:**
*   **Database Updates:**
    *   Add `aiCredits Int @default(100)` to the `User` model in `prisma/schema.prisma`.
    *   Run Prisma push/migration to synchronize the database.
*   **Session Management (`src/auth.ts` / `src/auth.config.ts`):**
    *   Update NextAuth callbacks to inject `aiCredits` into the token and `session.user` objects so the client UI can readily access the current balance.
*   **Credit Manager Utility (`src/lib/core/credits.ts`):**
    *   Create a `consumeAiCredit(userId: string, activeProvider: string, byokConfigs?: any)` helper.
    *   **Logic:**
        1.  If a valid `byokConfigs` exists for the active provider, return `true` (skip deduction).
        2.  If `user.aiCredits <= 0`, throw an error (e.g., "Insufficient AI Credits").
        3.  Decrement `aiCredits` by `1`.
        4.  If the new balance hits a low threshold (e.g., `10` or `0`), trigger the Alert System.
    *   **Alert System:**
        *   Create an in-app `Notification` (type `WARNING`) for the user.
        *   Create an in-app `Notification` for all users where `role === 'ADMIN'`.
        *   Implement a mock email dispatcher (`logger.info("EMAIL ALERT: ...")`) to fulfill the email mandate gracefully.
*   **Integration Points:**
    *   **AI Chat API (`src/app/api/chat/route.ts`):** Invoke `consumeAiCredit` before streaming generation. Handle 402/403 errors appropriately.
    *   **AI Server Actions (`src/app/actions/ai.ts`):** Update `getMultiPlatformAIPreviews` (and related generative functions) to verify and consume credits prior to requesting the AI generation.
*   **UI Updates:**
    *   Display the remaining `aiCredits` in the dashboard header (e.g., `UserActions.tsx` near the `NotificationBell` as a "⚡ {credits} Credits" badge or chip).
    *   Show an appropriate error toast or chat warning if the user attempts to generate content with `0` credits.

**TEST SPECIFICATION:**
*   **Happy Path:** A standard user with >0 credits triggers an AI chat generation and an AI post preview. Verify that `aiCredits` successfully decrements by 2, and the UI badge updates correctly on refresh or via session sync.
*   **Happy Path (BYOK):** A user with active BYOK credentials triggers AI generation. Verify that `aiCredits` remains completely untouched.
*   **Edge Case (Threshold Alert):** Manually set a user's credits to `11`. Trigger a single generation. Verify that the balance drops to `10`, the user receives a `WARNING` Notification in-app, admins receive a Notification, and the "EMAIL ALERT" log prints to the console.
*   **Negative Scenario:** A user with `0` credits attempts to use the AI Chat and the AI Generator. Both operations should cleanly fail with an "Insufficient AI Credits" error, blocking the request *before* any API cost is incurred, and the UI should gracefully display the error.
