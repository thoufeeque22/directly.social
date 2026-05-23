# Manual Test: 517 - BYOS Setup & Verification

This test verifies the successful configuration of Bring Your Own Storage (BYOS) and its integration with the upload pipeline.

## Prerequisites
- A Cloudflare R2 bucket or AWS S3 bucket.
- API Credentials (Access Key & Secret Key) with `Read`, `Write`, and `List` permissions.
- CORS rules enabled on the bucket (see `docs/features/BYOS_SUPPORT.md`).

## Test Steps

### 1. Wizard Navigation
1. Log in to Social Studio.
2. Navigate to **Settings** (Gear Icon).
3. Click on the **Storage** tab (4th tab).
4. **Expected Result:** The "Bring Your Own Storage" wizard is displayed.

### 2. Provider Selection
1. Select **Cloudflare R2**.
2. Click **Continue**.
3. **Expected Result:** Step 2 (CORS) is displayed with the recommended JSON policy.

### 3. Credentials Configuration
1. Click **Continue** on the CORS step.
2. Enter your **Bucket Name**.
3. Enter your **Endpoint URL** (for R2) or **Region** (for S3).
4. Enter your **Access Key ID** and **Secret Access Key**.
5. Click **Continue**.
6. **Expected Result:** Step 4 (Validation) is displayed.

### 4. Connection Validation
1. Click **Run Active Connection Checks & Save**.
2. **Expected Result:** 
   - A checklist appears showing real-time progress.
   - All 3 checks (Authorize, Validate Bucket, Verify Permissions) turn green.
   - A "Connection Active" alert is displayed.

### 5. Integration Verification
1. Navigate back to the **Dashboard**.
2. Look at the Upload Form header.
3. **Expected Result:** A green badge "BYOS: [Provider] Active Pipeline" is visible.

### 6. Functional Upload
1. Upload a video file (> 10MB) through the dashboard.
2. Monitor the status updates.
3. **Expected Result:** 
   - Status shows "Uploading to [Provider]...".
   - Upload completes successfully.
   - Video appears in the Gallery with a "BYOS" metadata tag.
