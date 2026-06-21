---
- **Verdict**: NECESSARY
- **SOCRATIC_LOG**: 
  ### Socratic Interrogation & Feasibility Assessment
  
  1. **Feasibility (Technical Constraints):**
     - **Stack Alignment:** The current project stack (Next.js 15, Prisma/PostgreSQL, `@aws-sdk/client-s3`) is fully compatible with S3/R2 integrations. The codebase already contains foundational utilities like `createS3Client` (factory in `src/lib/upload/s3/client.ts`), `createByosAsset` (in `src/lib/byos/complete-service.ts`), and `decryptByos` (in `src/lib/core/byos-encrypt`).
     - **Pagination Challenge:** S3's `ListObjectsV2` provides a unidirectional forward-only token (`ContinuationToken`). To support backward page navigation in the UI, the client must maintain a history stack of previous tokens (`[undefined, token1, token2]`).
     - **File Type Filtering:** Since S3 does not support server-side filtering by file extensions, the backend must fetch a page of items (e.g. 100 keys) and filter them locally to only include video files (checking extensions like `.mp4`, `.mov`, `.webm`, `.mkv`, `.avi`), returning exactly 12 items to the client. If more are needed, the backend can recursively fetch until the page limit is met or the bucket is exhausted.

  2. **Strategic Alignment (Problem Solved):**
     - Yes, this solves a critical problem: allowing users to connect their own storage buckets (S3/R2) to host and reuse their video libraries without incurring storage costs or upload limits on the host application. It merges externally uploaded assets with the app's database stage-posting flow seamlessly.

  3. **Architectural Integrity (Robust Engineering vs. "Vibe Coding"):**
     - **Lazy Registration Pattern:** Directly syncing the entire S3 bucket with the database on config save would create severe synchronization drift, performance overhead, and database bloat. Instead, listing objects via S3 API on the fly and only registering them in the database when the user clicks "Post" (Lazy Registration) is a clean, robust, and industry-standard architecture.
     - **Database Workspace Segregation:** By adding a `NOT: { metadata: { path: ['byos'], equals: true } }` condition to the GET `/api/media` endpoint, we cleanly separate BYOS assets from standard workspace uploads, ensuring no overlapping assets are displayed.

  4. **Necessity/Priority (Release Alignment):**
     - Crucial for Ticket 684. This delivers the core BYOS usability component (the actual file gallery UI).

  5. **External Dependencies & Cost:**
     - Zero new external dependencies are introduced. The codebase already depends on `@aws-sdk/client-s3`. The user provides their own S3/R2 storage, incurring no additional infrastructure costs for the application host.

  ### Design Decisions
  - **S3 Key Security Prefix Validation:** In both `register` and `delete` actions, the backend must validate that the requested S3 key starts with the user's configured `pathPrefix` to prevent path-traversal attacks and keep users confined to their designated directories.
  - **Pre-signed Video Previews:** To render video thumbnails/previews in the grid for unregistered assets without registering them in the DB, the GET `/api/media/byos` endpoint will generate temporary 2-hour pre-signed GET URLs directly from S3 using `getSignedUrl` on `GetObjectCommand`.

- **TECHNICAL SPECS**:
  ### 1. Database & Workspace Segregation
  - **GET `/api/media/route.ts`**:
    - Update the Prisma query to filter out BYOS assets (those where `metadata` contains `byos: true`).
    - Query Update:
      ```typescript
      where: {
        userId: session.user.id,
        expiresAt: { gt: new Date() },
        OR: [
          { metadata: { equals: prisma.DbNull } },
          {
            NOT: {
              metadata: {
                path: ['byos'],
                equals: true
              }
            }
          }
        ],
        ...(search ? { fileName: { contains: search, mode: 'insensitive' } } : {})
      }
      ```

  ### 2. Backend API Endpoints
  - **GET `/api/media/byos`**:
    - **Purpose:** Fetches a page of video assets from S3/R2.
    - **Query Parameters:** `continuationToken` (optional), `limit` (default 12).
    - **Logic:**
      1. Fetch decrypted `ByosConfig` using `getByosConfig(userId)`.
      2. If not configured, return `NextResponse.json({ error: "Storage not configured" }, { status: 400 })`.
      3. Instantiate S3 Client using `createS3Client(config)`.
      4. Call `ListObjectsV2Command` with `Bucket`, `Prefix` (config.pathPrefix), `MaxKeys: 100`, and `ContinuationToken`.
      5. Filter results to include only video extensions: `.mp4`, `.mov`, `.webm`, `.mkv`, `.avi`.
      6. Query database `GalleryAsset` to check which S3 keys are already registered:
         `prisma.galleryAsset.findMany({ where: { userId, metadata: { path: ['key'], in: filteredKeys } } })`.
      7. Construct response array of assets:
         - For registered assets: status badge "Cloud", `fileId`, and signed preview URL from `generateSignedMediaUrl(fileId)`.
         - For unregistered assets: status badge "External", `fileId: null`, and generate a temporary S3 pre-signed URL using `getSignedUrl` on `GetObjectCommand` (valid for 2 hours).
      8. Return `{ success: true, assets: ByosAsset[], nextContinuationToken, hasNextPage: isTruncated }`.
  
  - **POST `/api/media/register-byos`**:
    - **Purpose:** Lazily registers an S3 asset in the DB when "Post" is clicked.
    - **Payload:** `{ key: string, fileName: string, fileSize: number }`.
    - **Logic:**
      1. Fetch decrypted `ByosConfig`.
      2. Security check: verify `key` starts with `config.pathPrefix`.
      3. Call `createByosAsset(userId, { fileName, fileSize }, config.provider, config.bucketName, key)`.
      4. Return `{ success: true, fileId: newAsset.fileId }`.

  - **DELETE `/api/media/byos`**:
    - **Purpose:** Secures and handles deletion of an S3 object and DB cleanup.
    - **Payload:** `{ key: string, fileId?: string }`.
    - **Logic:**
      1. Fetch decrypted `ByosConfig`.
      2. If `fileId` is provided, fetch `GalleryAsset` and verify ownership. Use `metadata.key` as the S3 target.
      3. If `fileId` is not provided, verify that the `key` starts with `config.pathPrefix` (prevent directory traversal).
      4. Instantiate S3 Client and call `DeleteObjectCommand`.
      5. If a DB record exists (or `fileId` was provided), delete `GalleryAsset` via Prisma.
      6. Return `{ success: true }`.

  ### 3. Frontend UI Architecture
  - **`useByosConfig` hook:** Imported in `MediaLibrary.tsx` to control "My Cloud" tab visibility.
  - **Tab State Refactor:**
    - Change `tabValue` from numbers (`0, 1, 2`) to strings (`'workspace' | 'cloud' | 'local'`).
  - **New Component `ByosGallery.tsx`:**
    - Rendered when tab is `'cloud'`.
    - Handles loading (12 MUI `Skeleton` cards), empty state (centered `CloudQueueIcon`), and error state (MUI `Alert` with "Retry" button).
    - Grid items render `ByosGalleryCard.tsx`.
    - Pagination controls at the bottom: "Previous" (disabled if stack index is 0) and "Next" (disabled if `hasNextPage` is false).
  - **New Hook `useByosGallery.ts`:**
    - Manages page tokens stack: `const [tokenStack, setTokenStack] = useState<(string|undefined)[]>([undefined]);`.
    - Manages current page index and fetches `/api/media/byos?continuationToken=...`.
    - Implements "Post" button handler:
      - If asset is registered (`fileId` exists), immediately redirect to `/?staged=${fileId}`.
      - If unregistered, trigger POST `/api/media/register-byos`, show button loading spinner, then redirect to `/?staged=${newFileId}`.
    - Implements "Delete" button handler: shows `DeleteConfirmationDialog` and calls DELETE `/api/media/byos`.
  - **Modularity Constraint:** All new files (`ByosGallery.tsx`, `ByosGalleryCard.tsx`, `useByosGallery.ts`) must be strictly ≤ 100 lines each.

- **TEST SPECIFICATION**:
  ### Happy Paths
  1. **Tab Visibility:** Verify that the "My Cloud" tab is hidden when BYOS configuration is absent and visible when configured.
  2. **Unified Display:** Verify `/api/media/byos` correctly merges DB records (showing "Cloud" badge) and raw S3 items (showing "External" badge) on the same page.
  3. **Bi-directional Pagination:** Verify that clicking "Next Page" fetches the next batch using the `continuationToken` and clicking "Previous Page" correctly pops the stack to return to the previous page.
  4. **Lazy Registration Flow:** Verify that clicking "Post" on an "External" asset initiates database registration and transitions to `/?staged=${fileId}` once completed.
  5. **Workspace Segregation:** Verify that `GET /api/media` returns only standard workspace assets and excludes any assets with `byos: true` in their metadata.
  6. **Asset Deletion:** Verify deleting a "Cloud" asset removes the file from S3 and deletes the DB record. Verify deleting an "External" asset removes it from S3.

  ### Edge Cases
  1. **Empty Bucket:** Verify that the gallery renders the centered `CloudQueueIcon` and the text "No assets found in your storage bucket" (no emojis) when the bucket is empty.
  2. **Invalid Credentials / S3 Error:** Verify that a connection failure to S3 returns a descriptive error state, rendering a theme-aware MUI `Alert` with a "Retry" button.
  3. **Non-Video Filtering:** Verify S3 objects with non-video extensions (e.g. `.jpg`, `.pdf`) are filtered out and not rendered.
  4. **Boundary Pagination:** Verify "Previous Page" is disabled on the first page, and "Next Page" is disabled when `hasNextPage` is false.

  ### Security & Negative Paths
  1. **Unauthorized Actions:** Verify `/api/media/byos` (GET/DELETE) and `/api/media/register-byos` return `401 Unauthorized` for unauthenticated requests.
  2. **Directory Traversal / Prefix Escape:** Verify that requests to register or delete an S3 key that does not start with the user's `pathPrefix` are blocked (returning `400 Bad Request` or `403 Forbidden`).
  3. **Asset Cross-Deletion:** Verify a user cannot delete another user's `GalleryAsset` record or S3 object by passing a fabricated `fileId` or S3 key.
---
