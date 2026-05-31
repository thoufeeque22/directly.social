# Manual Test Script: Ticket #390 (Video Preview)

## Prerequisites
- A valid mp4 video file (short, < 90s)
- A valid mp4 video file (long, > 90s)
- An invalid/corrupted video file or non-video file renamed to .mp4

## Scenarios

### Scenario 1: Happy Path (Short Video)
1. Navigate to the Dashboard.
2. Click on the file upload dropzone.
3. Select the valid short mp4 video file.
4. **Verify**: The UI updates to display the `VideoPlayerPreview` component.
5. **Verify**: A green checkmark appears with the file name.
6. **Verify**: The format badge says "Short-Form" and displays the duration.
7. **Verify**: The video player controls are visible and functional (Play/Pause/Seek).
8. **Verify**: A thumbnail is generated and displayed below the video after it loads or is seeked.

### Scenario 2: Edge Case (Long Video Exceeding Short Limit)
1. Navigate to the Dashboard.
2. Upload the long mp4 video file.
3. **Verify**: The format badge accurately identifies the format (e.g., "Long-Form" or displays a warning if it's categorized as short but exceeds 90s).

### Scenario 3: Negative Case (Unsupported/Corrupted File)
1. Navigate to the Dashboard.
2. Upload the corrupted/invalid video file.
3. **Verify**: The video player displays a blank/black state or gracefully handles the error without crashing the application. The rest of the form should remain usable.
