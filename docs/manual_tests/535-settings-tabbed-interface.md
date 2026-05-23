# Manual Test: Settings Tabbed Interface & Progressive Disclosure

This test plan verifies the reorganized Settings page, including tab-based navigation, progressive disclosure of platform settings, and the platform roadmap.

## Prerequisites

1. Access to the Social Studio application.
2. An account with at least one platform connected (optional, but recommended).

## Test Cases

### 1. Tab-Based Navigation
- **Steps:**
  1. Navigate to **Settings**.
  2. Click on each tab: **Destinations**, **Snippets**, **AI Providers**, **Storage (BYOS)**.
- **Expected Results:**
  - The URL query parameter `tab` should update accordingly (e.g., `/settings?tab=snippets`).
  - The content below the tabs should change to match the active tab.
  - Tab state should be preserved on page refresh.

### 2. Progressive Disclosure (Platform Card)
- **Steps:**
  1. On the **Destinations** tab, find an inactive platform (e.g., YouTube).
  2. Toggle the switch to **Enabled**.
  3. Verify that a "Configuration" accordion appears.
  4. Click the accordion to expand it.
- **Expected Results:**
  - The accordion should only be visible when the platform is enabled.
  - When expanded, it should show **Account Connection** and **Advanced Settings (BYOK)**.
  - Toggling the platform to **Disabled** should hide the accordion.

### 3. Platform Roadmap (Coming Soon)
- **Steps:**
  1. Scroll down on the **Destinations** tab to the "Roadmap / Coming Soon" section.
- **Expected Results:**
  - Platforms like X (Twitter) or LinkedIn (if applicable) should be visible.
  - These cards should be grayscale, have a "Coming Soon" chip, and have a `not-allowed` cursor.
  - They should NOT be interactive.

### 4. Suggest a Platform
- **Steps:**
  1. Locate the "Something else?" card in the Roadmap section.
  2. Click the **Suggest Platform** button.
- **Expected Results:**
  - An alert should appear thanking the user for their request.

### 5. Unified Platform Management
- **Steps:**
  1. Expand the "Configuration" accordion for an enabled platform.
  2. Perform a BYOK validation check (e.g., enter mock credentials and click Validate).
- **Expected Results:**
  - The BYOK wizard should function correctly within the context of the platform card.
  - Account connection/disconnection should also function within the same card.

## Visual Verification

- **Aesthetic:** Verify the premium glass aesthetic is maintained across all tabs.
- **Hierarchy:** Check that "Destinations" is the primary focus and "Coming Soon" is clearly secondary.
- **Responsiveness:** Verify that the tab bar and platform grids are responsive on mobile/tablet.
- **Indicators:** Ensure the connection status dot (green/gray) in the platform header is clearly visible.
