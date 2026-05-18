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
  - The page should display "BYOK Settings" title.
  - Wizards for "YouTube" and "TikTok" (or other supported platforms) should be visible.
  - Input fields (Client ID, Secret, Redirect URI) should be empty.

### 2. Validation: Empty Fields
- **Steps:**
  1. On the YouTube BYOK wizard, leave all fields empty.
  2. Click **Save Credentials**.
- **Expected Results:**
  - Validation error "Client ID is required" (or similar) should appear.
  - No success message should be shown.

### 3. Validation: Invalid URL
- **Steps:**
  1. Enter "valid" for Client ID and Client Secret.
  2. Enter "not-a-url" for Redirect URI.
  3. Click **Save Credentials**.
- **Expected Results:**
  - Validation error "Invalid Redirect URI" should appear.

### 4. Successful Credential Save (Happy Path)
- **Steps:**
  1. Enter "valid" for Client ID.
  2. Enter any value for Client Secret.
  3. Enter `https://socialstudio.ai/api/auth/callback/youtube` for Redirect URI.
  4. Click **Save Credentials**.
- **Expected Results:**
  - A loading spinner should briefly appear.
  - Success message "Credentials saved successfully!" should be displayed.

### 5. Persistence Check
- **Steps:**
  1. After successful save in Test Case 4, refresh the page.
  2. Open Browser Developer Tools -> Application -> Local Storage.
  3. Locate the key `byok_YouTube`.
- **Expected Results:**
  - The `byok_YouTube` key should exist in Local Storage.
  - The value should be a JSON string containing the entered credentials.

### 6. Mock Validation Failure
- **Steps:**
  1. Enter "invalid" for Client ID.
  2. Enter any values for other fields.
  3. Click **Save Credentials**.
- **Expected Results:**
  - Error message "Invalid credentials for YouTube" should appear (based on mock validator logic).

## Visual Verification

Verify that the UI matches the design standards:
- Material UI components are used.
- Spacing is consistent.
- Loading states and error/success colors (Red/Green) are correctly applied.
- Compare against artifacts in `verification/byok-wizard-*.png`.
