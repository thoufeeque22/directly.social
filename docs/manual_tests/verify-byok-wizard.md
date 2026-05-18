# Manual Test: BYOK Integration Wizard

This test plan verifies the functionality, validation, and persistence of the Platform BYOK Integration Wizard.

## Prerequisites

1. Access to the Social Studio application (development or staging).
2. A valid platform developer account (e.g., Google Cloud Console for YouTube) or mock credentials for testing validation.

## Test Cases

### 1. Navigation and Initial State
- **Steps:**
  1. Log in to Social Studio.
  2. Navigate to **Settings**.
  3. Click on the **BYOK Settings** link/button.
- **Expected Results:**
  - The URL should be `/settings/byok`.
  - The page should display "BYOK Integrations" title.
  - A "Back to Settings" button should be visible at the top.
  - Wizards for **YouTube**, **TikTok**, **Facebook**, and **Instagram** should be visible in a responsive grid layout.
  - Each wizard should be enclosed in a `GlassCard` with a platform-specific icon (YouTube: Red, TikTok: Black Music Note, Facebook: Blue, Instagram: Gradient/Pink).
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
  3. Enter `https://socialstudio.ai/api/auth/callback/youtube` for Redirect URI.
  4. Click **Validate & Save Credentials**.
- **Expected Results:**
  - A loading spinner should appear inside the button.
  - A green `Alert` should appear with the title "Connection Successful".
  - Message: "Your YouTube BYOK credentials have been saved securely."

### 6. Persistence Check
- **Steps:**
  1. After successful save in Test Case 5, refresh the page.
  2. Open Browser Developer Tools -> Application -> Local Storage.
  3. Locate the key `byok_YouTube`.
- **Expected Results:**
  - The `byok_YouTube` key should exist in Local Storage.
  - The value should be a JSON string containing the entered credentials.

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
