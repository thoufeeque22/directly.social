# Manual Test Script: Ticket 742 (Cloudflare R2 Migration)

**Feature**: Migrate Media Storage from Vercel Blob to Cloudflare R2
**Ticket**: #742

## Prerequisites
1. You have a valid account on `directly.social`.
2. The environment variables (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`) are properly configured in your local environment.
3. The development server is running (`pnpm dev`).

## Test Steps

### Scenario 1: Successful Video Upload directly to Cloudflare R2
1. Log in to the application.
2. Navigate to the upload or staging page.
3. Select a valid video file (e.g., `public/dummy.mp4`) that is under the 500MB limit.
4. Open the browser's Developer Tools and go to the **Network** tab.
5. Initiate the upload.
6. **Expected Result**: 
   - A request to `/api/upload/presigned-url` should be successful (returns 200).
   - An `OPTIONS` and `PUT` request directly to the Cloudflare R2 bucket URL should appear and succeed (returns 200).
   - A final request to `/api/upload/assemble` should be made with the new R2 public URL instead of the Vercel Blob URL.
   - The UI should indicate a successful upload and display the uploaded video.

### Scenario 2: Unsupported File Size Rejection
1. Attempt to upload a video file larger than 500MB.
2. **Expected Result**: 
   - The backend `/api/upload/presigned-url` should reject the request with a 400 Bad Request.
   - The UI should display an appropriate error message to the user.

### Scenario 3: Unauthenticated Access Prevention
1. Open an incognito window or log out of the application.
2. Attempt to manually hit the `/api/upload/presigned-url` endpoint (e.g., using a curl command or Postman).
3. **Expected Result**: The endpoint should return a 401 Unauthorized status.
