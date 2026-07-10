# Manual Test Script: Ticket 741

**Feature**: Video Uploads (Chunked Streaming & Rate Limiting)
**Test Type**: Functional & System Boundaries
**Status**: DRAFT

## Prerequisites
1. Local development server running (`pnpm dev`).
2. An active user session (logged in via Google/Facebook/TikTok).
3. A test video file larger than 10MB to ensure chunking logic triggers.

## Scenario 1: Verify Chunked Video Upload Succesfully bypasses Vercel FS constraints
**Description**: Ensure that the application correctly utilizes `os.tmpdir()` for chunk staging instead of the read-only `/var/task/tmp`.

1. **Step**: Navigate to the Activity Hub (`/activity?action=distribute`).
2. **Step**: Initiate a new video post by selecting the >10MB test video file.
3. **Step**: Monitor the Network Tab in your browser's Developer Tools.
4. **Expected Result**: 
   - Multiple `chunk` requests fire sequentially.
   - All `chunk` requests return `200 OK`.
   - None of the requests fail with an `ENOENT: mkdir '/var/task/tmp'` error.
5. **Step**: Verify the video completes processing and shows up as "Ready" or "Uploading" in the UI without crashing.

## Scenario 2: Verify High-Frequency Rate Limiting
**Description**: Ensure that the aggressive chunked upload does not trip the platform's `uploadRateLimit` (which was increased to 120 req/min).

1. **Step**: Clear the network tab and initiate a second upload using a very large file (e.g., 100MB+) that will generate dozens of rapid chunk requests.
2. **Step**: Observe the `chunk` requests in the Network Tab.
3. **Expected Result**:
   - The chunk requests stream successfully.
   - None of the requests return a `429 Too Many Requests` status with the message `"Rate limit exceeded. Please try again later."`
   - The upload completes successfully.

## Verification Checklist
- [ ] Vercel read-only filesystem crash (`ENOENT`) is eradicated.
- [ ] Chunk requests are no longer blocked by `uploadRateLimit`.
- [ ] Uploads complete and metadata is assembled properly from `/tmp/directly_social`.
