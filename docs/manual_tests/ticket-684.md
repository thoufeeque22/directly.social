# Manual Test Script: Bring Your Own Storage Gallery - "My Cloud" (Ticket #684)

## Overview
Verify the UI layout, responsiveness, theme-awareness, accessibility, and functional workflows of the new "My Cloud" tab in the Media Library, which integrates local DB records with external S3/R2 storage buckets.

## Prerequisites
1. Run the local development server: `npm run dev`.
2. Open the browser and navigate to `http://localhost:3000`.
3. Log in with a standard test user account.
4. Have access to a configured/test S3 or Cloudflare R2 bucket.

---

## Test Scenarios

### Scenario 1: Dynamic Tab Visibility
1. **Disconnected Storage State**:
   - Navigate to **Settings** -> **Storage** and disconnect any configured storage connection.
   - Click on the **Media Library** tab or navigate to `/media`.
   - **Expected Result:** Only the "Workspace" and "Local" tabs are visible. The "My Cloud" tab is completely hidden.
2. **Connected Storage State**:
   - Navigate back to **Settings** -> **Storage** and complete the BYOS connection wizard with valid credentials.
   - Navigate to `/media`.
   - **Expected Result:** The "My Cloud" tab is visible next to "Workspace" and "Local".

### Scenario 2: Skeleton Loading & Card Grid Layout
1. Navigate to `/media` and click on the **My Cloud** tab.
2. Observe the loading state.
3. **Expected Result:**
   - A grid of skeleton loader cards (`MUI Skeleton`) is rendered briefly during the API call.
   - Once loading completes, S3/R2 video objects are rendered as cards in a clean grid matching the main workspace media layout.
   - If the bucket has no video files matching support extensions (`.mp4`, `.mov`, `.webm`, `.avi`, `.mkv`), a centered `CloudQueueIcon` (with 50% opacity) is shown alongside the text: `"No assets found in your storage bucket"`. No emojis must be present.

### Scenario 3: Hover Video Preview & Metadata Display
1. Hover the cursor over one of the video asset cards in the "My Cloud" tab.
2. Observe the card's behavior.
3. **Expected Result:**
   - The card thumbnail replaces with a video element and starts playing the video preview using a secure pre-signed GET URL (valid for 2 hours).
   - Once mouse leaves the card, the video stops playing and reverts to the static thumbnail.
   - The card properly displays the file name (truncated with a CSS ellipsis if it is too long), the formatted file size (e.g., `12 MB`), the last modified date, and a status chip:
     - **External** (grey/orange chip) - if the object exists in S3 but is not registered in the application database.
     - **Cloud** (green/blue chip) - if the object is registered in the application database.

### Scenario 4: Bidirectional Pagination
1. Prepare a bucket containing at least 25 video files.
2. Navigate to `/media` -> **My Cloud** tab.
3. **Expected Result:**
   - The page renders the first 12 videos.
   - The "Previous Page" button at the bottom toolbar is disabled.
   - The "Next Page" button is enabled.
4. Click the **Next Page** button.
5. **Expected Result:**
   - Page 2 loads and renders the next 12 videos.
   - Both "Previous Page" and "Next Page" buttons are enabled.
6. Click the **Next Page** button again.
7. **Expected Result:**
   - Page 3 loads and renders the remaining 1 video.
   - The "Next Page" button is disabled.
   - The "Previous Page" button is enabled.
8. Click the **Previous Page** button.
9. **Expected Result:**
   - The page navigates back to Page 2, rendering the correct set of 12 videos.
   - "Previous Page" and "Next Page" buttons remain enabled.

### Scenario 5: Lazy DB Registration (Post Flow)
1. Navigate to `/media` -> **My Cloud** tab.
2. Locate a video asset card with an **External** status chip.
3. Click the **Post** button (icon: `PostAdd`).
4. **Expected Result:**
   - The card shows a `CircularProgress` loading spinner in place of the button.
   - An API request is sent to POST `/api/media/register-byos` with the object's metadata.
   - A `GalleryAsset` record is created in the database with a 100-year expiration date, `"READY"` status, and metadata indicating its BYOS status.
   - The page redirects to `/?staged=[fileId]`.
5. Navigate back to `/media` -> **My Cloud** tab.
6. Locate the same video card.
7. **Expected Result:** The status chip has transitioned from **External** to **Cloud**.
8. Click the **Post** button on the **Cloud** asset.
9. **Expected Result:** The page immediately redirects to `/?staged=[fileId]` without sending a POST request to re-register.

### Scenario 6: S3 Object Deletion and DB Sync
1. Navigate to `/media` -> **My Cloud** tab.
2. Hover over a card and click the **Delete** button (icon: `Delete`).
3. **Expected Result:** A MUI confirmation dialog appears asking: `"Are you sure you want to delete this asset?"`.
4. Click **Cancel**.
5. **Expected Result:** The dialog closes and the asset remains in the grid.
6. Click the **Delete** button again, and click **Delete** inside the dialog.
7. **Expected Result:**
   - The card shows a `CircularProgress` loading spinner in place of the delete icon.
   - The object is deleted from S3.
   - Any corresponding `GalleryAsset` records for this user and S3 key are deleted from the database.
   - The gallery list automatically re-fetches and the deleted asset is removed from the grid.
8. **Permissions Error Scenario (Write-restricted Credentials)**:
   - Configure a mock storage connection using credentials that lack Delete permissions.
   - Navigate to `/media` -> **My Cloud** tab, click **Delete** on an asset, and confirm.
   - **Expected Result:**
     - The S3 client returns `AccessDenied`, and the route handler returns a `403 Forbidden` response.
     - The dialog closes, the card stops loading, and a clean, theme-aware MUI `Alert` is displayed: `"Failed to delete asset. Insufficient bucket delete permissions."`.
     - The asset is NOT removed from the grid and remains in the database.

### Scenario 7: Responsive Design & Light/Dark Theme Compliance
1. Open the **My Cloud** tab on a mobile viewport (e.g. `375px` width in DevTools).
2. **Expected Result:**
   - The tab bar adapts gracefully (e.g., scrollable tabs or stacked buttons).
   - The card grid wraps down to a single-column layout.
   - All text inside the card remains readable without truncation issues or overflow.
3. Switch the application between **Light Mode** and **Dark Mode**.
4. **Expected Result:**
   - Backgrounds, cards, text colors, and the bottom toolbar transition seamlessly.
   - The status chips (External vs Cloud) retain appropriate background contrast and readable text on both themes.
   - MUI alert messages for errors are styled correctly under both themes.
