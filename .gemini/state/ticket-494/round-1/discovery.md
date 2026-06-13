
## [2026-06-13 16:08:44] Verdict: APPROVED
**VERDICT:** APPROVED

**SOCRATIC_LOG:**
1. **Data Export Storage:** We will use a dedicated system-level S3/R2 bucket (`system-exports`) for temporary storage of data exports. This ensures availability even if a user has not configured their own BYOS. Files will be purged after 48h by the existing cleanup worker.
2. **Token Revocation:** Account deletion will include a 'Best Effort' revocation phase. If a platform API is down, we will log the failure and proceed with record purging to ensure the 'Right to be Forgotten' is honored within our system.
3. **Identity Verification:** For Deletion and Export, we will enforce re-authentication via password. For OAuth-only users (no password), we will implement a 'Verification Code' sent to their registered email.
4. **Cookie Scope:** Currently, the app uses zero third-party tracking scripts. 'Analytics' consent will specifically control the internal high-frequency telemetry (`trackEvent` utility) to ensure user privacy choices are honored even for internal metrics.

**TECHNICAL SPECS:**

1. **Privacy Service (`src/lib/services/privacy.ts`)**
   - `requestDataExport(userId)`: Asynchronous task. Gathers data from User, Account, GalleryAsset, PostActivity, MetadataTemplate. Generates signed link. Triggers email.
   - `executeAccountDeletion(userId)`: 
     - Step 1: Revoke platform tokens via new `PlatformRevoker` utility.
     - Step 2: Delete physical assets in Storage (Local + BYOS) via `ByosService.deleteFile`.
     - Step 3: `prisma.user.delete` (leveraging existing cascade rules).
   
2. **Platform Revocation Utility (`src/lib/platforms/revoke.ts`)**
   - `revokeGoogle(token)`: POST to `https://oauth2.googleapis.com/revoke`.
   - `revokeTikTok(token)`: POST to `https://open-api.tiktok.com/v2/auth/revoke/`.
   - `revokeFacebook(token)`: DELETE to `graph.facebook.com/v12.0/me/permissions`.

3. **Cookie Consent System**
   - **Cookie:** `ss-consent` (HttpOnly: false for client-side reading, SameSite: Lax).
   - **Banner Component:** Fixed glassmorphic banner in `src/components/gdpr/CookieBanner.tsx`.
   - **Integration:** Update `trackEvent` in `telemetry.ts` to check the consent cookie before execution.

4. **UI Integration**
   - New tab in Settings: `/settings/privacy`.
   - Implementation of `PrivacyTab.tsx` with re-auth guards for destructive actions.

**TEST SPECIFICATION:**

1. **Functional (Happy Path):**
   - Verify `ss-consent` cookie is present after clicking 'Accept All'.
   - Verify export email is received and download link contains a valid JSON matching the schema.
   - Verify account deletion removes all records from `User`, `Account`, and `GalleryAsset` tables.

2. **Edge Cases:**
   - Attempt to download an expired export link (48h+).
   - Account deletion for a user with 100+ gallery assets (verify timeout handling in worker).
   - Cookie banner visibility in PWA/Mobile wrapper (verify it doesn't overlap with native navigation).

3. **Negative Scenarios:**
   - Trigger deletion with incorrect password -> Ensure 401 Unauthorized and zero data loss.
   - Trigger export for a user with no data -> Ensure JSON is valid empty skeleton.

