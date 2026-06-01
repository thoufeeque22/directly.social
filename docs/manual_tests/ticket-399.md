# Manual Test Script for Ticket 399: Add Support / Help Link

**Environment:** Development / Staging

## Pre-requisites
1. Application is running.
2. User is logged in to Social Studio.

## Test Cases

### Scenario 1: Verify Support Link in Sidebar
**Steps:**
1. Open the application and navigate to the Dashboard (or any main page).
2. Look at the left sidebar (or open the hamburger menu if on mobile).
3. Verify that the "Support" link is present in the navigation menu, represented with a HelpOutlinedIcon.

**Expected Result:**
The "Support" link is clearly visible in the sidebar navigation.

### Scenario 2: Verify Navigation to Support Tab
**Steps:**
1. Click the "Support" link in the sidebar.
2. Observe the URL in the browser address bar.
3. Observe the highlighted tab on the Settings page.

**Expected Result:**
- URL updates to `/settings?tab=support`.
- The UI transitions to the Settings page with the "Support" tab actively selected.

### Scenario 3: Verify Support Tab Content
**Steps:**
1. Ensure you are on the Support tab (`/settings?tab=support`).
2. Verify the presence of the main heading "Support & Help".
3. Verify the presence of the "Contact Us" section.
4. Click the "Email Support" button.

**Expected Result:**
- The heading "Support & Help" is visible.
- The "Email Support" button is visible.
- Clicking the "Email Support" button opens the default email client with the `to:` field set to `support@socialstudio.app`.

### Scenario 4: Verify FAQs Section
**Steps:**
1. Scroll down to the "Frequently Asked Questions" section on the Support tab.
2. Verify that common questions and answers are displayed.

**Expected Result:**
- The FAQs section is visible.
- Questions like "How do I connect my social media accounts?" and "Can I use my own API keys for AI generation?" are listed with corresponding answers.
