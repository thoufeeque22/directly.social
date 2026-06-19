
# Manual Test: Media Library

**Objective:** To verify that the Media Library functionality is working correctly after the refactoring.

**Prerequisites:**
- The application is running locally.
- You are logged in as a user.

## Test Cases

| Test Case ID | Description | Steps | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- |
| ML-001 | **Verify Media Library Page Loads** | 1. Navigate to the `/media` page. | The page should load successfully, and the "Media Library" heading should be visible. | | |
| ML-002 | **Verify Empty State** | 1. Ensure the media library is empty. If not, click "Clear Gallery". | The page should display the "No assets in the gallery" message. | | |
| ML-003 | **Upload a Video** | 1. Click the "Add New Video" button. <br> 2. Select a video file to upload. | The video should appear in the media library grid, and a success notification should be shown. | | |
| ML-004 | **Search for a Video** | 1. Upload a video with a unique name. <br> 2. Type the name of the video in the search bar. | The media library grid should be filtered to show only the video that matches the search query. | | |
| ML-005 | **Select and Deselect a Video** | 1. Hover over a video in the grid. <br> 2. Click the checkbox to select the video. <br> 3. Click the checkbox again to deselect it. | The "Delete (1)" button should appear when the video is selected and disappear when it is deselected. | | |
| ML-006 | **Delete a Single Video** | 1. Select a single video. <br> 2. Click the "Delete (1)" button. <br> 3. Confirm the deletion in the dialog. | The video should be removed from the media library. | | |
| ML-007 | **Bulk Delete Videos** | 1. Select multiple videos. <br> 2. Click the "Delete (X)" button (where X is the number of selected videos). <br> 3. Confirm the deletion in the dialog. | The selected videos should be removed from the media library. | | |
| ML-008 | **Clear Gallery** | 1. Upload one or more videos. <br> 2. Click the "Clear Gallery" button. | All videos should be removed from the media library, and the empty state should be displayed. | | |
