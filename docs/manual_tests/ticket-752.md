# Manual Test Script for Ticket 752: BYOS Secret Leakage

## Goal
Verify that the AWS S3/Cloudflare R2 `secretAccessKey` is never exposed in plain text to the client side.

## Prerequisites
1. Log in to the application as an Admin or valid User.
2. Ensure you have valid or dummy AWS S3/Cloudflare R2 credentials (Bucket Name, Region/Endpoint, Access Key, Secret Key).

## Scenario 1: Verify Masking on Retrieval (GET)
1. Navigate to **Settings > Storage**.
2. Select **AWS S3 Compatible** or **Cloudflare R2** and progress to the Credentials step.
3. Enter test credentials, including a known `Secret Access Key` (e.g., `SuperSecret123`).
4. Click **Continue** and save the configuration.
5. Open the **Browser Developer Tools** (F12) and go to the **Network** tab.
6. Refresh the page or navigate away and back to **Settings > Storage**.
7. Locate the network request to `GET /api/settings/byos`.
8. Inspect the Response payload.
9. **Expected Result**: The `secretAccessKey` field in the response must either be completely omitted OR its value must be masked exactly as `"********"`. It must NOT reveal `SuperSecret123`.

## Scenario 2: Verify Unchanged Secret on Update (POST Edge Case)
1. After completing Scenario 1, ensure the UI displays the secret input field as `********` or obscured dots.
2. Modify a benign setting, such as the **Bucket Name** (e.g., change `my-bucket` to `my-bucket-v2`).
3. Leave the **Secret Access Key** field as is (it should submit `********` or an empty value depending on the UI logic).
4. Save the configuration.
5. **Expected Result**: The save succeeds without validation errors regarding the secret. The application preserves the encrypted secret on the backend.
