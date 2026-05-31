# Manual Test Script: Ticket #400 Notification Utility

## Prerequisites
- Logged in as `tester@socialstudio.ai`.
- Notifications seeded in the database.

## Test Case 1: Notification Visibility & Badge Count
1. **Action:** Navigate to the Dashboard.
2. **Expected Result:** 
   - Notification bell icon is visible in the top right header.
   - Red badge shows the correct unread count (e.g., '3').

## Test Case 2: Opening the Popover
1. **Action:** Click the Notification Bell.
2. **Expected Result:** 
   - Popover opens below the bell.
   - Header "Notifications" is visible.
   - List of notifications is displayed with correct messages and icons.
   - Unread notifications have a subtle blue background.

## Test Case 3: Mark Single as Read
1. **Action:** Click an unread notification item.
2. **Expected Result:** 
   - The notification's background becomes transparent.
   - The text font weight changes from bold to normal.
   - **CRITICAL:** The badge count on the bell icon decreases by 1 immediately.

## Test Case 4: Mark All as Read
1. **Action:** Click the "Mark all as read" button in the popover.
2. **Expected Result:** 
   - All notifications in the list update to 'read' state (transparent background, normal font).
   - **CRITICAL:** The badge count on the bell icon disappears or becomes 0 immediately.

## Test Case 5: Empty State
1. **Action:** (Requires no notifications for user) Open the popover.
2. **Expected Result:** 
   - "No notifications yet." message is displayed.
   - "Mark all as read" button is hidden.

## Regression / Performance Note
- Verify that opening the popover does not trigger an excessive number of network requests (check Network tab for multiple `getNotifications` calls).
