# Manual Test Script - Ticket 418 (TikTok Integration)

## Prerequisites
- Test environment running with TikTok developer sandbox configured.
- Valid video assets (`small_video.mp4` < 50MB, `large_video.mp4` > 50MB).

## Scenarios
1. **Happy Path:** Authenticate TikTok Account via Settings > Integrations.
2. **Happy Path:** Single Chunk Video Upload (< 50MB) and verify `publish_id`.
3. **Happy Path:** Multi-Chunk Video Upload (> 50MB) and verify chunking UI progress.
4. **Edge Scenario:** Throttle network mid-upload to verify intermittent network retry logic.
5. **Edge Scenario:** Unsupported File Specs (try >4K resolution or > limit) to verify error messages.
6. **Negative Scenario:** Invalid/Expired access token triggers re-auth prompt on publish attempt.
7. **Negative Scenario:** Authorization Revocation Webhook wipe of user tokens and associated data from DB.
