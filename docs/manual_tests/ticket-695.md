# Manual Test: Delete Account Flow (Ticket #695)

**Objective**: Verify that users can safely and securely delete their account, and that all associated data is removed correctly.

## Prerequisites
- A test user account with active sessions and some connected platforms (e.g., mock YouTube or TikTok connection).
- Access to the application running locally (`http://localhost:3000`).

## Test Steps

### Scenario 1: Account Deletion UI and Safeguards
1. Log in to the application as the test user.
2. Navigate to **Settings**.
3. Verify that there is an **Account** tab visible.
4. Click on the **Account** tab.
   - **Expected**: You should see a "Danger Zone" section with a red "Delete Account" button.
5. Click the **Delete Account** button.
   - **Expected**: A confirmation modal opens.
   - **Expected**: The modal displays the warning: *"If you delete your account, your data can't be recovered, but you can create your account using the same credentials again."*
6. Observe the "Delete Account" confirm button inside the modal.
   - **Expected**: The button is disabled.
7. Type random text (e.g., "delete", "test") into the confirmation input.
   - **Expected**: The "Delete Account" confirm button remains disabled (must be exactly "DELETE").
8. Type "DELETE" into the input.
   - **Expected**: The "Delete Account" confirm button becomes enabled.

### Scenario 2: Account Deletion Execution
1. Click the enabled **Delete Account** button in the modal.
2. **Expected**: 
   - A success alert/toast appears.
   - The user is immediately signed out.
   - The user is redirected to the home/login page.
3. Attempt to log in again with the same credentials (if not OAuth).
   - **Expected**: The login fails because the account no longer exists.
4. Inspect the Database (via Prisma Studio or SQL shell):
   - Check the `User` table for the user's ID. -> **Expected**: Record does not exist.
   - Check the `Session` table for the user's ID. -> **Expected**: Record does not exist.
   - Check the `Account` table (OAuth connections) for the user's ID. -> **Expected**: Records do not exist.
