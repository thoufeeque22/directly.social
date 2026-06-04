# Manual Test: BYOK Integration Wizard

This test plan verifies the functionality, validation, and persistence of the Platform BYOK Integration Wizard.

## Prerequisites

1. Access to the Directly application (development or staging).
2. A valid platform developer account (e.g., Google Cloud Console for YouTube) or mock credentials for testing validation.

## Test Cases

### 1. Navigation and Initial State
- **Steps:**
  1. Log in to Directly.
  2. Navigate to **Settings**.
  3. Ensure the **Destinations** tab is active.
  4. Find a platform (e.g., YouTube) and toggle it to **Enabled**.
  5. Expand the **Configuration** accordion.
  6. Locate the **Advanced Settings (BYOK)** section.
- **Expected Results:**
  - The URL should be `/settings?tab=destinations`.
  - The "Configuration" accordion should be visible and expandable.
  - The BYOK wizard should be visible inside the accordion.
  - Each wizard should have platform-specific instructions and links.
  - Step 1 (Get Your Keys) and Step 2 (Configure Credentials) should be clearly demarcated.

### 2. External Portal Links
- **Steps:**
  1. Locate the YouTube wizard and click **Go to Developer Portal**.
  2. Locate the TikTok wizard and click **Go to Developer Portal**.
  3. Locate the Facebook/Instagram wizards and click **Go to Developer Portal**.
- **Expected Results:**
  - YouTube: Opens Google Cloud Console.
  - TikTok: Opens TikTok for Developers console.
  - Facebook/Instagram: Opens Meta for Developers portal.

### 3. Validation: Empty Fields
- **Steps:**
  1. On the YouTube BYOK wizard, leave all fields empty.
  2. Click **Validate & Save Credentials**.
- **Expected Results:**
  - A red `Alert` should appear with the title "Validation Failed".
  - The message should indicate that Client ID is required.

### 4. Validation: Invalid URL
- **Steps:**
  1. Enter "valid" for Client ID and Client Secret.
  2. Enter "not-a-url" for Redirect URI.
  3. Click **Validate & Save Credentials**.
- **Expected Results:**
  - A red `Alert` should appear indicating "Invalid Redirect URI".

### 5. Successful Credential Save (Happy Path)
- **Steps:**
  1. Enter "valid" for Client ID.
  2. Enter any value for Client Secret.
  3. Enter `https://directly.social/api/auth/callback/youtube` for Redirect URI.
  4. Click **Validate & Save Credentials**.
- **Expected Results:**
  - A loading spinner should appear inside the button.
  - A green `Alert` should appear with the title "Connection Successful".
  - Message: "Your YouTube BYOK credentials have been saved securely."

### 6. Persistence Check
- **Steps:**
  1. After successful save in Test Case 5, refresh the page.
  2. Log in with the same user on a different browser or clear browser cache.
  3. Navigate back to **Settings -> BYOK Settings**.
- **Expected Results:**
  - The wizard for YouTube should show that credentials are saved (e.g., fields populated or a "Manage" state if implemented, or simply no "Validation Failed" on refresh).
  - Check the database (if possible via `npx prisma studio`) to verify a record exists in the `ByokCredential` table for the user.
  - **Verification:** The `byok_YouTube` key should NOT be present in Local Storage (as it was migrated to server-side).

### 7. Mock Validation Failure
- **Steps:**
  1. Enter "invalid" for Client ID.
  2. Enter any values for other fields.
  3. Click **Validate & Save Credentials**.
- **Expected Results:**
  - A red `Alert` with "Validation Failed" should appear.
  - Error message "Invalid credentials for YouTube" should be visible.

## Visual Verification

Verify that the UI matches the design standards:
- Material UI components are used exclusively.
- **GlassCard** effect is visible (translucency/blur if implemented).
- Icons (YouTube, MusicNote, OpenInNew) are correctly colored and sized.
- Spacing is clean and consistent (using MUI `Stack` and `Box` padding).
- Button hover states show subtle elevation/shadow changes.
- Compare against screenshots in `verification/`.
