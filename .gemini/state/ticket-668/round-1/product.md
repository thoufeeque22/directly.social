# Product Specification: Modular Media Library (Ticket #668)

## 🎯 Goal
Refactor the monolithic `MediaLibrary.tsx` into a modular, high-performance, and aesthetically consistent component suite using Material UI (MUI). The goal is to improve maintainability (100-line rule) and elevate the UX for creators managing short-form video assets.

## 🎨 UX Strategy & Industry Benchmarking

### Competitive Analysis
- **Google Photos:** Utilizes a clean grid with hover effects and a floating contextual bar for bulk actions.
- **Canva / Unsplash:** Strong focus on search and aspect-ratio filtering to find the right asset quickly.
- **Adobe Bridge:** Clear indicators for asset lifecycle (metadata, expiry).

### The "Lean Gallery" Concept
The app's unique "7-day purge" (Lean Gallery) requires clear visibility of expiry times. The UX must prioritize "time remaining" to prevent accidental data loss.

### Interaction Flow
1. **Discovery:** Users land on the gallery and can quickly search or filter by orientation (9:16 vs 16:9).
2. **Management:** Multi-select allows for batch deletion or "staged" status checking.
3. **Action:** Hovering a card triggers a video preview. Clicking "Post" redirects to the dashboard with the asset pre-selected.
4. **Safety:** Destructive actions (Delete, Clear) are guarded by MUI Dialogs instead of browser alerts.

## 🛠 Modular UI Components

### 1. `MediaLibraryHeader`
- **Location:** Top of the page.
- **Content:** Title ("Media Gallery"), Subtitle, and Primary "Add Video" button.
- **Style:** Sticky positioning with glassmorphism backdrop.

### 2. `MediaLibraryFilters` (New)
- **Placement:** Below the header, above the grid.
- **Features:**
    - `SearchField`: Full-width or expandable search.
    - `OrientationToggle`: Quick filter for Portrait (9:16) vs Landscape (16:9).
    - `SortSelect`: Options for "Newest Added" and "Expiring Soon".

### 3. `MediaLibraryGrid`
- **Logic:** Handles the mapping of assets and the "Empty State" fallback.
- **Layout:** MUI responsive grid (`repeat(auto-fill, minmax(180px, 1fr))`).

### 4. `MediaPreviewCard` (Formerly `MediaPreview`)
- **Visuals:** 
    - Video element with "hover-to-play" logic.
    - Badge for aspect ratio (e.g., "9:16").
    - Expiry countdown with color-coded urgency (Red for <24h).
    - Checkbox overlay for selection.
- **Actions:** Quick "Post" and "Delete" buttons.

### 5. `MediaLibraryHUD`
- **Location:** Fixed bottom-center.
- **Content:** Selection count, "Cancel" button, and "Delete Selected" button.
- **State:** Also displays upload progress/status when a file is being staged.

### 6. `MediaLibraryEmptyState`
- **Content:** Large icon, "No videos found" message, and a secondary "Upload Video" button.

## 🚦 Error & Edge Cases
- **Upload Failure:** HUD should turn red and show a retry option or clear error message.
- **Empty Search:** Distinct message from "Empty Library" to help user clear filters.
- **Expiring Assets:** Pulse animation or high-contrast warning for assets with <2 hours left.

## ✅ Verdict: APPROVED
The strategy is ready for technical discovery. The focus on orientation filtering and MUI-based interaction patterns aligns with the project's standards.

## [2026-06-18 19:00:26] Verdict: APPROVED
# Product Specification: Modular Media Library (Ticket #668)

## 🎯 Goal
Refactor the monolithic `MediaLibrary.tsx` into a modular, high-performance, and aesthetically consistent component suite using Material UI (MUI). The goal is to improve maintainability (100-line rule) and elevate the UX for creators managing short-form video assets.

## 🎨 UX Strategy & Industry Benchmarking

### Competitive Analysis
- **Google Photos:** Utilizes a clean grid with hover effects and a floating contextual bar for bulk actions.
- **Canva / Unsplash:** Strong focus on search and aspect-ratio filtering to find the right asset quickly.
- **Adobe Bridge:** Clear indicators for asset lifecycle (metadata, expiry).

### The "Lean Gallery" Concept
The app's unique "7-day purge" (Lean Gallery) requires clear visibility of expiry times. The UX must prioritize "time remaining" to prevent accidental data loss.

### Interaction Flow
1. **Discovery:** Users land on the gallery and can quickly search or filter by orientation (9:16 vs 16:9).
2. **Management:** Multi-select allows for batch deletion or "staged" status checking.
3. **Action:** Hovering a card triggers a video preview. Clicking "Post" redirects to the dashboard with the asset pre-selected.
4. **Safety:** Destructive actions (Delete, Clear) are guarded by MUI Dialogs instead of browser alerts.

## 🛠 Modular UI Components

### 1. `MediaLibraryHeader`
- **Location:** Top of the page.
- **Content:** Title ("Media Gallery"), Subtitle, and Primary "Add Video" button.
- **Style:** Sticky positioning with glassmorphism backdrop.

### 2. `MediaLibraryFilters` (New)
- **Placement:** Below the header, above the grid.
- **Features:**
    - `SearchField`: Full-width or expandable search.
    - `OrientationToggle`: Quick filter for Portrait (9:16) vs Landscape (16:9).
    - `SortSelect`: Options for "Newest Added" and "Expiring Soon".

### 3. `MediaLibraryGrid`
- **Logic:** Handles the mapping of assets and the "Empty State" fallback.
- **Layout:** MUI responsive grid (`repeat(auto-fill, minmax(180px, 1fr))`).

### 4. `MediaPreviewCard` (Formerly `MediaPreview`)
- **Visuals:** 
    - Video element with "hover-to-play" logic.
    - Badge for aspect ratio (e.g., "9:16").
    - Expiry countdown with color-coded urgency (Red for <24h).
    - Checkbox overlay for selection.
- **Actions:** Quick "Post" and "Delete" buttons.

### 5. `MediaLibraryHUD`
- **Location:** Fixed bottom-center.
- **Content:** Selection count, "Cancel" button, and "Delete Selected" button.
- **State:** Also displays upload progress/status when a file is being staged.

### 6. `MediaLibraryEmptyState`
- **Content:** Large icon, "No videos found" message, and a secondary "Upload Video" button.

## 🚦 Error & Edge Cases
- **Upload Failure:** HUD should turn red and show a retry option or clear error message.
- **Empty Search:** Distinct message from "Empty Library" to help user clear filters.
- **Expiring Assets:** Pulse animation or high-contrast warning for assets with <2 hours left.

## ✅ Verdict: APPROVED
The strategy is ready for technical discovery. The focus on orientation filtering and MUI-based interaction patterns aligns with the project's standards.

