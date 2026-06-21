---
- **Verdict**: APPROVED
- **UX Strategy**:
  1. **Dynamic Tab Integration**:
     - Load `useByosConfig` hook on page load. While `isChecking` is true, display a circular progress spinner.
     - If `hasByos` is true, render the "My Cloud" tab. Otherwise, hide the tab.
     - Use string identifiers (`'workspace'`, `'cloud'`, `'local'`) instead of raw numbers for tab selection state to prevent indexing conflicts and UI rendering bugs.
  2. **Seamless Drafting Flow**:
     - Display a "Post" button (using MUI `PostAdd` icon) on each card.
     - For already registered database assets, clicking "Post" navigates to `/?staged=${fileId}`.
     - For unregistered external assets (discovered via S3 list), clicking "Post" initiates an asynchronous call to `/api/media/register-byos` which registers the asset and returns the `fileId`. The UI displays a button-level loading spinner during this phase, then redirects to `/?staged=${newFileId}`.
  3. **Workspace Segregation**:
     - The Workspace tab displays standard assets. The GET `/api/media` handler is updated to filter out assets containing `{ byos: true }` in their metadata JSON. This ensures the two tabs show non-overlapping sets of media.

- **Industry Standards**:
  - **Separate Channels**: Competitors like Buffer and Hootsuite keep short-term uploads and persistent cloud storage assets in separate tabs or panels, preserving clean boundaries.
  - **Client-side Lazy-loading and Pagination**: Cloud storage buckets can contain millions of files. Grid views should load assets in pages (12 cards per page) using S3 `ListObjectsV2` continuation tokens.
  - **Bidirectional Paging Stack**: Since S3 `ContinuationToken` is unidirectional, the client-side state maintains a stack of continuation tokens to allow backward page navigation.
  - **Lazy Registration**: Only register external objects in the DB on demand (when "Post" is clicked), preventing DB bloat and syncing issues.

- **UI Layout**:
  - **My Cloud Tab Layout**:
    - Displays a grid of video asset cards matching the style of the standard Workspace tab.
    - Each card displays:
      - Video thumbnail/preview (MUI Video component).
      - File name (truncated with ellipsis).
      - File size (formatted e.g. "12 MB").
      - Last modified date (formatted).
      - Status badge: "Cloud" (for registered app uploads) or "External" (for newly discovered S3 files).
      - Card Actions: A "Post" button and a "Delete" button (if write permissions are configured).
  - **Pagination Controls**:
    - Bottom-centered toolbar containing "Previous Page" and "Next Page" buttons.
    - Buttons are disabled based on stack index and `hasNextPage` indicator.
  - **States**:
    - **Loading State**: A grid of 12 skeleton cards (MUI `Skeleton`).
    - **Empty State**: Centered `CloudQueueIcon` (50% opacity) with text "No assets found in your storage bucket" (no emojis).
    - **Error State**: Theme-aware MUI `Alert` with text "Failed to connect to storage. Verify credentials in settings." and a "Retry" button.

- **Interrogation Log**:
  - **Q**: How should we handle sub-folders in S3 buckets (paths)?
    - **A**: The initial implementation will list all objects matching the user's `pathPrefix` flatly. Support for nested sub-folder exploration can be added in a future iteration.
  - **Q**: Can users delete files from their S3 bucket via the "My Cloud" tab?
    - **A**: The "My Cloud" tab will support delete options only if the user's storage credential has write permissions. Deleted items will be removed from S3 and their corresponding local DB records cleaned up.
---

## [2026-06-21 16:38:11] Verdict: APPROVED
---
- **Verdict**: APPROVED
- **UX Strategy**:
  1. **Dynamic Tab Integration**:
     - Load `useByosConfig` hook on page load. While `isChecking` is true, display a circular progress spinner.
     - If `hasByos` is true, render the "My Cloud" tab. Otherwise, hide the tab.
     - Use string identifiers (`'workspace'`, `'cloud'`, `'local'`) instead of raw numbers for tab selection state to prevent indexing conflicts and UI rendering bugs.
  2. **Seamless Drafting Flow**:
     - Display a "Post" button (using MUI `PostAdd` icon) on each card.
     - For already registered database assets, clicking "Post" navigates to `/?staged=${fileId}`.
     - For unregistered external assets (discovered via S3 list), clicking "Post" initiates an asynchronous call to `/api/media/register-byos` which registers the asset and returns the `fileId`. The UI displays a button-level loading spinner during this phase, then redirects to `/?staged=${newFileId}`.
  3. **Workspace Segregation**:
     - The Workspace tab displays standard assets. The GET `/api/media` handler is updated to filter out assets containing `{ byos: true }` in their metadata JSON. This ensures the two tabs show non-overlapping sets of media.

- **Industry Standards**:
  - **Separate Channels**: Competitors like Buffer and Hootsuite keep short-term uploads and persistent cloud storage assets in separate tabs or panels, preserving clean boundaries.
  - **Client-side Lazy-loading and Pagination**: Cloud storage buckets can contain millions of files. Grid views should load assets in pages (12 cards per page) using S3 `ListObjectsV2` continuation tokens.
  - **Bidirectional Paging Stack**: Since S3 `ContinuationToken` is unidirectional, the client-side state maintains a stack of continuation tokens to allow backward page navigation.
  - **Lazy Registration**: Only register external objects in the DB on demand (when "Post" is clicked), preventing DB bloat and syncing issues.

- **UI Layout**:
  - **My Cloud Tab Layout**:
    - Displays a grid of video asset cards matching the style of the standard Workspace tab.
    - Each card displays:
      - Video thumbnail/preview (MUI Video component).
      - File name (truncated with ellipsis).
      - File size (formatted e.g. "12 MB").
      - Last modified date (formatted).
      - Status badge: "Cloud" (for registered app uploads) or "External" (for newly discovered S3 files).
      - Card Actions: A "Post" button and a "Delete" button (if write permissions are configured).
  - **Pagination Controls**:
    - Bottom-centered toolbar containing "Previous Page" and "Next Page" buttons.
    - Buttons are disabled based on stack index and `hasNextPage` indicator.
  - **States**:
    - **Loading State**: A grid of 12 skeleton cards (MUI `Skeleton`).
    - **Empty State**: Centered `CloudQueueIcon` (50% opacity) with text "No assets found in your storage bucket" (no emojis).
    - **Error State**: Theme-aware MUI `Alert` with text "Failed to connect to storage. Verify credentials in settings." and a "Retry" button.

- **Interrogation Log**:
  - **Q**: How should we handle sub-folders in S3 buckets (paths)?
    - **A**: The initial implementation will list all objects matching the user's `pathPrefix` flatly. Support for nested sub-folder exploration can be added in a future iteration.
  - **Q**: Can users delete files from their S3 bucket via the "My Cloud" tab?
    - **A**: The "My Cloud" tab will support delete options only if the user's storage credential has write permissions. Deleted items will be removed from S3 and their corresponding local DB records cleaned up.
---

