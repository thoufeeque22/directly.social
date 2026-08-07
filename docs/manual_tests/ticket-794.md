# Manual Test Script: LinkedIn Video Uploading (Ticket 794)

## Prerequisites
- A valid test account with a connected LinkedIn profile.
- A sample `.mp4` video file under the allowed size limit.
- The application running locally (`pnpm dev`).

## Test Scenarios

### Scenario 1: Upload a Video to LinkedIn successfully
1. Log into the application and navigate to the dashboard.
2. Select the file upload area.
3. Choose the sample `.mp4` video file.
4. In the platform selection options, verify **LinkedIn** is available and select it.
5. Add a caption.
6. Click **Submit**.
7. **Expected Result**: 
   - UI shows uploading progress.
   - Success notification appears.
   - The video appears in the connected LinkedIn account's feed.

### Scenario 2: File size limit validation
1. Attempt to upload a video larger than the allowed limit.
2. **Expected Result**: 
   - The UI rejects the file immediately with a size limit error message.

### Scenario 3: Missing LinkedIn connection
1. Log in with an account lacking a LinkedIn connection.
2. Navigate to the upload screen and select a video.
3. **Expected Result**: 
   - LinkedIn is disabled in the platform selection.
   - A prompt to "Connect LinkedIn account" is shown.
