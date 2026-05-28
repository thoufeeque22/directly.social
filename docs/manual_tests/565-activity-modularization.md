# Manual Test: Activity Modularization (#565)

## Overview
This test verifies that the modularized Activity domain (Page, Hooks, and Actions) functions correctly across all core user flows, including filtering, pagination, and platform-specific actions.

## Prerequisites
- A running development environment.
- At least one user account with existing post activity (past and scheduled).
- Multiple platforms connected (e.g., Local, YouTube) to verify platform-specific results.

## Test Scenarios

### 1. Initial Load & Data Display
1.  Navigate to the `/activity` page.
2.  **Verify:** The page loads without errors.
3.  **Verify:** `ActivityHeader` displays the correct title and any global actions.
4.  **Verify:** `ActivityList` renders activity cards for existing posts.
5.  **Verify:** Each `ActivityCard` shows the post title, description, and scheduled/created date.

### 2. Filtering & Search
1.  Enter a search term in the search bar.
2.  **Verify:** The list updates to show only matching posts (title/description).
3.  Change the status filter (e.g., "Published", "Scheduled").
4.  **Verify:** The list filters correctly based on the selected status.
5.  Clear all filters.
6.  **Verify:** The full list of activity items is restored.

### 3. Pagination
1.  If activity exceeds 10 items, navigate to Page 2.
2.  **Verify:** The list updates with the next set of items.
3.  **Verify:** The URL updates to reflect the current page (e.g., `?page=2`).
4.  Return to Page 1.
5.  **Verify:** The list updates correctly.

### 4. Activity Card Details & Platforms
1.  Locate a card with multiple platforms.
2.  **Verify:** `PlatformResultItem` displays the status (Success/Fail) and platform icon for each target.
3.  **Verify:** Clicking on a platform pill/icon (if applicable) shows platform-specific details or errors.

### 5. Actions (Retry/Cancel/Delete)
1.  **Retry:** Locate a failed post. Click the "Retry" button.
    - **Verify:** The retry action is triggered via `useActivityActions`.
    - **Verify:** The post status updates to reflect the retry attempt.
2.  **Cancel:** Locate a scheduled or in-progress post. Click "Cancel".
    - **Verify:** The cancellation is processed and the UI updates.
3.  **Delete:** Click the delete icon on a activity card.
    - **Verify:** The item is removed from the list after confirmation.

### 6. Cockpit Mode (Real-time Monitoring)
1.  Trigger a new distribution (e.g., from the Dashboard or via a Retry).
2.  **Verify:** The "Cockpit" UI appears or updates to show live progress.
3.  **Verify:** Statuses update automatically as platforms complete their tasks (polling).

## Expected Results
- No console errors or hydration mismatches.
- Smooth transitions between filter states and pages.
- Accurate representation of platform-specific statuses and error messages.
- Functional "Retry", "Cancel", and "Delete" actions with immediate UI feedback.
