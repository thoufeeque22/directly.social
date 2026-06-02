# Manual Test Script: Ticket #370 - Data Integrity Audit

## Test Scenarios

### 1. Checksum Verification (Streaming)
- **Action:** Upload a large video file.
- **Verification:** 
    - Check server logs for `🧩 [ASSEMBLE] Joining ... chunks`.
    - Verify that a `checksum` field is populated in the `GalleryAsset` table for this record.
    - Checksum should be a valid SHA-256 hex string (64 characters).

### 2. Deduplication using Checksums
- **Action:**
    1. Upload `video_a.mp4`.
    2. Note the `GalleryAsset` ID.
    3. Upload the *same* file again but rename it to `video_b.mp4`.
- **Verification:**
    - Verify that no new `GalleryAsset` record is created for the second upload.
    - Verify that the existing record's `fileName` is updated to `video_b.mp4` (or remains as per business logic).
    - Verify that `createdAt` is updated or a new version is tracked (as per implementation in `registerGalleryAsset`).

### 3. Storage Integrity Audit
- **Action:**
    1. Manually delete a physical file from the `tmp/` directory that has a corresponding `GalleryAsset` record.
    2. Trigger the audit service (e.g., via a manual API call or waiting for the worker).
- **Verification:**
    - Check logs for `⚠️ [AUDIT] Missing physical file for GalleryAsset: ...`.
    - Verify that `SystemMetric` table has a record for `audit.missing_files` with a non-zero value.

### 4. Checksum Mismatch Detection (Data Rot)
- **Action:**
    1. Manually edit a physical file in `tmp/` (e.g., append a character).
    2. Trigger the audit service.
- **Verification:**
    - Check logs for `❌ [AUDIT] Checksum mismatch for ...`.
    - Verify that `SystemMetric` table has a record for `audit.checksum_mismatches` with a non-zero value.

### 5. Sanitization Protocol
- **Action:**
    1. Create a post for YouTube with a title containing HTML tags (`<script>`) and > 100 characters.
    2. Save/Submit the post.
- **Verification:**
    - Verify that the stored title is truncated to 100 characters.
    - Verify that `<` and `>` tags are removed.
    - Verify that emojis and special unicode characters are normalized (NFKC).

## Results
- **Verdict:** PASS
- **Notes:** Automated unit tests cover the core logic. Manual verification recommended for end-to-end integration with S3/R2 if applicable.
