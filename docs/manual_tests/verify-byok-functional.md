# Manual Test: BYOK Functional Integration

This test plan verifies that user-provided BYOK credentials are correctly utilized by the distribution pipeline and prioritize over global environment variables.

## Prerequisites

1. Access to the Directly application (development or staging).
2. A valid platform developer account with an app created (e.g., YouTube/Google Cloud).
3. BYOK credentials (Client ID, Secret, Redirect URI) for the platform.
4. Access to server logs or Sentry to verify credential resolution if needed (optional).

## Test Cases

### 1. Functional Integration: YouTube Upload
- **Steps:**
  1. Navigate to **Settings -> BYOK Settings**.
  2. Configure and save valid BYOK credentials for **YouTube**.
  3. Navigate to the **Schedule** page.
  4. Upload a video and schedule it for immediate publication (or use "Publish Now" if available).
  5. Select **YouTube** as the target platform.
  6. Monitor the publication process.
- **Expected Results:**
  - The video should be successfully uploaded to the user's personal YouTube channel (associated with their BYOK app).
  - The OAuth consent screen (if triggered) should display the name of the user's personal app, not "Directly".
  - Verify in the `PostPlatformResult` that the upload succeeded.

### 2. Fallback Mechanism: Missing BYOK
- **Steps:**
  1. Ensure **no** BYOK credentials are configured for **TikTok**.
  2. Schedule a video for **TikTok**.
  3. Monitor the publication process.
- **Expected Results:**
  - The system should fall back to the global `TIKTOK_CLIENT_ID` and `TIKTOK_CLIENT_SECRET`.
  - The upload should proceed using the application's shared quota.

### 3. Credential Precedence (Prioritization)
- **Steps:**
  1. Configure BYOK credentials for **Facebook**.
  2. Perform a publication to **Facebook**.
- **Expected Results:**
  - The `CredentialProvider` must log (or be verified via debugger) that it selected the `USER` level credentials.
  - The publication should utilize the user-provided Client ID/Secret.

### 4. Error Handling: Invalid BYOK Secret
- **Steps:**
  1. Navigate to **BYOK Settings**.
  2. Intentionally save an **incorrect** Client Secret for YouTube (if the health check can be bypassed or if the secret is rotated later).
  3. Attempt a YouTube publication.
- **Expected Results:**
  - The publication should fail with a clear error message in the UI (e.g., "Authentication failed: Invalid BYOK credentials").
  - The system should NOT silently fall back to global keys if BYOK is explicitly configured but failing (to prevent unexpected quota usage or account mix-ups).

## Verification via Logs

If you have access to server logs:
1. Look for log entries from `CredentialProvider`.
2. Verify that `Resolved credentials for user <id> on platform <platform>: source=BYOK` appears when keys are present.
3. Verify that `Resolved credentials for user <id> on platform <platform>: source=GLOBAL` appears when keys are absent.
