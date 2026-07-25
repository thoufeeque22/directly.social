# Manual Test Script: LinkedIn Integration (Ticket #412)

## Prerequisites
1. Ensure the application is running locally.
2. Ensure you have two test user accounts:
   - A **Free Tier** account.
   - A **Pro/Enterprise Tier** account.
3. Access to a valid LinkedIn Developer account with the `w_member_social` and `r_liteprofile` scopes approved for the application.

## Test Cases

### Test Case 1: Pricing Anchor (Free Tier)
1. **Action:** Log in as the Free Tier user.
2. **Action:** Navigate to the **Settings > Destinations** tab.
3. **Expected:** The LinkedIn Integration card should be visible.
4. **Expected:** The card should display a "Locked" icon or state.
5. **Expected:** Clicking the card or the associated action button should prompt an "Upgrade" CTA, enforcing the Decoy Pricing & FOMO strategy.

### Test Case 2: Standard Integration Flow (Pro Tier)
1. **Action:** Log in as the Pro/Enterprise Tier user.
2. **Action:** Navigate to the **Settings > Destinations** tab.
3. **Expected:** The LinkedIn Integration card should be visible and **unlocked**.
4. **Action:** Click the "Connect" button on the LinkedIn card.
5. **Expected:** The "Authorization Bridge" modal should appear.
6. **Expected:** The modal should clearly state compliance with the "LinkedIn Marketing Developer Program" and mention the data policies.
7. **Action:** Click "Proceed to LinkedIn" (or equivalent) in the modal.
8. **Expected:** You are redirected to the LinkedIn OAuth login page.

### Test Case 3: Successful Connection & Scheduling (Pro Tier)
1. **Action:** Complete the LinkedIn OAuth flow and approve the requested permissions (`w_member_social`, `r_liteprofile`).
2. **Expected:** You are redirected back to the application.
3. **Expected:** The LinkedIn card now shows a "Connected" state (e.g., displaying the profile name).
4. **Action:** Navigate to the **Compose/Schedule** page.
5. **Action:** Create a test post and select LinkedIn as the destination. Schedule it for a future time.
6. **Expected:** The post is successfully scheduled.

### Test Case 4: Token Revocation Wipe Protocol (Passive & Active)
1. **Action:** While connected, go to your actual LinkedIn account settings (on linkedin.com) and **revoke** the application's access.
2. **Action:** Back in the application, attempt to schedule a new post to LinkedIn.
3. **Expected:** The action fails. The backend should intercept the `401 Unauthorized` response.
4. **Expected:** A cascading wipe is triggered. Your LinkedIn tokens and settings are immediately removed from the database.
5. **Expected:** Refreshing the **Settings > Destinations** page should show LinkedIn in the disconnected (but unlocked) state.

### Test Case 5: Free Tier API Bypass Rejection
1. **Action:** Log in as the Free Tier user.
2. **Action:** Attempt to schedule a post to LinkedIn by intercepting the network request and modifying the payload (or using an API client like Postman with the user's session token).
3. **Expected:** The backend API should return a `403 Forbidden` error with an "Upgrade required" message. The post must not be scheduled.
