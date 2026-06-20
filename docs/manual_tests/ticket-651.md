# Manual Test Script for Ticket 651: Local FileSystem Vault

## Setup
1. Use a Chromium-based browser (Google Chrome or Microsoft Edge) for full feature testing.
2. Ensure you have a local directory containing at least one test video file (e.g., `.mp4`).
3. Start the application and ensure you are logged in (or using the tester role).

## Test Cases

### Case 1: Browser Support Alert
**Objective:** Verify that unsupported browsers display an appropriate warning.
1. Open a browser that does not support the File System Access API (e.g., Firefox or Safari).
2. Navigate to `/media`.
3. Click on the "Local Vault" tab.
**Expected Result:** A warning alert displaying "Local Vault is unsupported. Please use Chrome/Edge." should be visible.

### Case 2: Folder Connection & Badge Verification
**Objective:** Verify that connecting a local directory correctly populates the asset list.
1. Open Google Chrome or Microsoft Edge.
2. Navigate to `/media` and click the "Local Vault" tab.
3. Click the "Connect Directory" button.
4. When prompted by the browser, select a local folder containing video files and grant read access.
**Expected Result:** The directory list populates with the assets from the folder. Each asset should display a permanent green "Local Vault" chip, and video preview players should be active.

### Case 3: Composer Redirection
**Objective:** Verify that posting a local asset redirects correctly to the composer.
1. Complete the steps in Case 2 to connect a local directory.
2. Locate a video asset in the list and click the "Post" button on its card.
**Expected Result:** The application redirects to the root URL (`/`). The composer is populated with the selected file, and the preview player correctly loads and displays the local video file.

### Case 4: Restore Permission Alert
**Objective:** Verify the application handles expired directory handles correctly and allows restoring access.
1. Connect a directory successfully (Case 2).
2. Refresh the page to simulate an expired handle state (or close and reopen the browser).
3. Navigate back to `/media` -> "Local Vault" tab.
**Expected Result:** An alert stating "Access to the connected directory needs to be restored" is displayed. The asset grid is not loaded.
4. Click the "Restore Access" button.
5. Grant permission when prompted by the browser.
**Expected Result:** The warning alert disappears, and the asset grid loads successfully.
