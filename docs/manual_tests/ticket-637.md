# Manual Test Script: Ticket-637 UI Audit & Metadata Refactor

## Prerequisites
1. Logged in as a user with at least two connected social accounts (e.g., YouTube and TikTok).
2. "Manual" AI Strategy selected in the Upload Form.

## Test Case 1: Platform-Specific Metadata Capture
1. **Action**: Select YouTube and TikTok from the platform list.
2. **Action**: Toggle "Separate titles/descriptions per platform" ON.
3. **Verification**: Verify that specific input fields for YouTube Title, YouTube Description, TikTok Title, and TikTok Description appear.
4. **Action**: Fill in unique data for each field.
5. **Action**: Toggle "Separate titles/descriptions per platform" OFF and then ON again.
6. **Verification**: Verify that the previously entered data is preserved.

## Test Case 2: Clear and Undo Functionality
1. **Action**: Click the '✕' (Clear) button on a platform-specific title field.
2. **Verification**: The field should become empty. An "Undo Clear" button should appear.
3. **Action**: Click "Undo Clear".
4. **Verification**: The original text should be restored. Field character count should update correctly.

## Test Case 3: Activity Hub Title Promotion
1. **Action**: Leave the global "Title" field empty.
2. **Action**: Fill in a specific title for the first selected platform (e.g., YouTube).
3. **Action**: Upload a file and click "Post Now".
4. **Verification**: In the Activity Hub, the card title should display the platform-specific title instead of the default date fallback.

## Test Case 4: Multi-Title Badge
1. **Action**: Enter different titles for YouTube and TikTok.
2. **Action**: Submit the post.
3. **Verification**: In the Activity Hub card, verify that a "Multi-Title" badge is visible next to the card title.

## Test Case 5: Regression - Standard Upload
1. **Action**: Perform an upload without toggling platform-specific metadata.
2. **Verification**: Ensure the upload proceeds normally and metadata is applied globally to all platforms.
