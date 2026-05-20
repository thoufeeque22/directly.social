# Manual Test: What's New Notification (Issue #398)

## Prerequisites
1. Ensure the database is migrated with the new `UpdateLog` and `UserSeenUpdate` models.
2. Seed the database with at least one update log.
   ```bash
   npx tsx scripts/seed-whats-new.ts
   ```
3. Log in as a standard user.

## Test Steps

### 1. Verification of "New" Badge
1. Navigate to any page (e.g., Dashboard).
2. Observe the Header near the user profile.
3. **Expected Result:** A "New" badge (MUI Chip) should be visible.

### 2. Opening the "What's New" Modal
1. Click on the "New" badge in the Header.
2. **Expected Result:** A modal titled "What's New" should appear, displaying the list of seeded updates with their titles and descriptions.

### 3. Verification of Badge Clearance
1. Close the "What's New" modal (or it might have cleared as soon as it opened).
2. Observe the Header.
3. **Expected Result:** The "New" badge should no longer be visible.

### 4. Persistence Check
1. Refresh the page.
2. Observe the Header.
3. **Expected Result:** The "New" badge remains hidden as the updates have been marked as seen.

### 5. New Update Notification
1. (Simulated) Add another update log to the database.
2. Refresh the page.
3. **Expected Result:** The "New" badge should reappear.

## Success Indicators
- [ ] Badge appears when new updates exist.
- [ ] Modal correctly displays update content.
- [ ] Badge disappears after viewing the modal.
- [ ] State persists across page reloads.
