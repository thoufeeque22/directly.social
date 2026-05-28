# Manual Test Script: Ticket #575 - Activity Domain Modularization

## Overview
This test verifies that the refactored Activity domain (Server Actions, Hooks, and UI components) maintains full functionality after modularization to adhere to the 50-line rule.

## 1. Page Load & Data Integrity
**Objective**: Ensure the Activity Hub loads correctly and displays posts.
1. Navigate to `/activity`.
2. Verify "Activity Hub" heading is visible.
3. Verify existing posts are listed with correct titles and platforms.
4. Verify that "Load More" appears if there are many posts and loads subsequent pages correctly.

## 2. Search & Filtering
**Objective**: Verify search functionality is still reactive and accurate.
1. Type a known post title in the search bar.
2. Verify the list filters automatically (with debounce).
3. Clear the search and verify the full list returns.

## 3. Cancellation Flow
**Objective**: Verify "Cancel Platform" and "Cancel All" actions.
1. Start an upload or find an active upload in the list.
2. Click the "Cancel" button for a specific platform.
3. Verify the platform status changes to "cancelled" (Optimistic UI check).
4. Verify the server reflects this cancellation upon refresh.
5. Click "Cancel All" for a post with multiple active platforms.
6. Verify all active platforms for that post are cancelled.

## 4. Retry Logic
**Objective**: Verify "Retry" action for failed posts.
1. Find a post with a "failed" status on one or more platforms.
2. Click the "Retry" button.
3. Verify the platform status changes to "retrying" or "uploading" (Optimistic UI).
4. Verify the retry execution completes (successful or failed again).

## 5. Auto-Title & Metadata (Cockpit)
**Objective**: Verify metadata display in the Activity Cockpit.
1. Click on a post to open the Cockpit view.
2. Verify metadata (Title/Description) is displayed correctly.

## 6. Optimistic UI & State Sync
**Objective**: Ensure the UI stays in sync without full page reloads.
1. Perform a delete or retry action.
2. Observe if the UI updates immediately before the server response.
3. Ensure no flickering or unexpected state jumps occur.

## 7. Polling Mechanism
**Objective**: Verify background polling keeps statuses up-to-date.
1. Leave the Activity page open while an upload is happening in the background.
2. Verify statuses (e.g., progress percentage) update automatically without refresh.
