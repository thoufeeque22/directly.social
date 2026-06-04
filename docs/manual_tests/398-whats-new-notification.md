# Manual Test: What's New Notification (Issue #398)

## Prerequisites
- Logged in to Directly.
- At least one `UpdateLog` entry exists in the database that the user has NOT seen.

## Setup (Optional: Seed Update)
If no updates exist, run the following in the database (or via a temporary script):
```sql
INSERT INTO "UpdateLog" (id, version, title, description, "createdAt")
VALUES ('test-update-1', '1.0.0', 'Welcome to Directly', 'This is your first update notification.', NOW());
```

## Test Steps

### 1. Verification of Badge Visibility
1. Navigate to the Dashboard.
2. Observe the Header area.
3. **Expected Result:** A red badge with a number (e.g., "1") should be visible on the "New Releases" icon (star/bolt icon).

### 2. Opening the "What's New" Modal
1. Click on the badge icon in the Header.
2. **Expected Result:** The "What's New" modal should open, displaying the title and description of the unseen update.

### 3. Dismissing an Update
1. In the "What's New" modal, click the "Got it" button next to the update.
2. **Expected Result:**
   - The modal should close (if it was the only update).
   - The badge in the Header should disappear (or the count should decrease).
   - A refresh of the page should NOT show the badge again for the dismissed update.

### 4. Persistence Check
1. Refresh the page.
2. **Expected Result:** The badge should remain hidden if all updates were dismissed.

## Visual Verification
Refer to the following artifacts for the intended look and feel:
- `verification/whats-new-badge.png`
- `verification/whats-new-modal.png`
