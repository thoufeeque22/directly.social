# Manual Test: User Profile Dropdown Menu & What's New Popover (Issue #398)

This manual test suite verifies the profile actions dropdown menu in the header and its integration with the persistent "What's New" changelog popover (Option A persistent notifications).

## Prerequisites
- The user is logged in to Social Studio.
- The database contains at least one update in the `UpdateLog` table.
- A test user exists.

## Setup (Optional: Direct Database Seeding)
To verify unread status transitions, ensure at least one unread update exists for the test user. If needed, seed an update directly:
```sql
INSERT INTO "UpdateLog" (id, version, title, description, "createdAt")
VALUES ('test-dropdown-update-1', '1.3.0', 'Profile Menu Refactor', 'This is a test notification for the profile menu integrations.', NOW());
```

## Test Cases

### Test Case 1: Header Layout Verification
1. Navigate to the Dashboard.
2. Inspect the right side of the Header component.
3. **Expected Results:**
   - The flat utility buttons (like "What's New" button or text links) should no longer be visible.
   - The global notifications bell icon, "+ Create Post" action button, and the user's Profile Avatar (or first letter initial if no image exists) should render cleanly with consistent spacing.
   - If there are unread updates, a red notification badge showing the number of unread updates (e.g. "1") must be displayed over the "New Releases" icon.

### Test Case 2: Opening the User Profile Dropdown Menu
1. Click on the user's Profile Avatar in the top-right corner.
2. **Expected Results:**
   - A dropdown menu opens cleanly below the avatar trigger.
   - The dropdown menu contains two primary menu items:
     - **What's New** (Target element: `whats-new-profile-link`)
     - **Sign Out** (Target element: `sign-out-button`)
   - The dropdown is responsive and doesn't trigger horizontal scrolling or page layout shifting.

### Test Case 3: Accessing What's New Persistent Popover via Profile Dropdown
1. Open the user profile dropdown menu.
2. Click on the **What's New** menu item.
3. **Expected Results:**
   - The profile menu dropdown closes smoothly.
   - The **What's New** popover opens, anchored to the profile avatar's position.
   - The popover displays the active unread updates (if any exist) or a loading spinner followed by the historical changelog (if all updates are read).
   - If there were unread updates:
     - The red notification badge over the "New Releases" icon in the header instantly clears and disappears in the background.
     - The background network request to `markUpdateAsSeen` is fired successfully.
     - The global state context updates the count to 0.

### Test Case 4: Dismissing Updates in the Popover
1. Click the "New Releases" badge icon in the header (if unread updates are present) to show the popover.
2. Observe the items displayed inside the popover.
3. Click the "Got it" button next to an unread update item.
4. **Expected Results:**
   - The dismissed update is immediately filtered out from the local view.
   - If multiple unread updates were present, they can be dismissed individually, or all at once using the "Dismiss All" button.
   - When all unread updates are dismissed, the view smoothly transitions to the historical read updates list.

### Test Case 5: Persistence & Verification
1. Click outside the popover to close it.
2. Refresh the browser page.
3. **Expected Results:**
   - The red notification badge does NOT reappear on the "New Releases" icon.
   - Click the user's Profile Avatar, then select **What's New**.
   - The popover opens and displays the historical read updates (including the recently dismissed updates), confirming that update status updates are persisted correctly in PostgreSQL.

## Visual Reference
Refer to the following visual verification screenshots under the `verification/` folder:
- `verification/whats-new-badge.png` - Visual proof of the notification badge.
- `verification/whats-new-profile-link.png` - Visual proof of the user profile dropdown menu and persistent "What's New" option.
- `verification/whats-new-popover-unread.png` - Visual proof of unread updates in the popover.
- `verification/whats-new-popover-history.png` - Visual proof of the historical changelog in the popover.
