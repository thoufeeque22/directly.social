# Manual Test: Settings Sidebar Refactor

**Objective**: Verify that the Settings page utilizes a responsive Master-Detail layout, grouping tabs logically, and adapting cleanly to both Desktop and Mobile viewports.

## Prerequisites
- Access to the application running locally (`http://localhost:3000/settings`).
- Ability to resize the browser window or use browser dev tools to toggle device emulation.

## Test Steps

### Scenario 1: Desktop Two-Column Layout
1. Navigate to `/settings` on a desktop browser window (wide screen).
2. **Expected**: The screen is split into two columns. 
   - Left side: A vertical sidebar showing settings categories (Account, Support, Destinations, AI Providers, Storage, Snippets).
   - Right side: The content pane displaying the active category.
3. Click on the **Account** category in the sidebar.
   - **Expected**: The URL updates to `?tab=account`. The right content pane shows the Account Settings.
   - **Expected**: The sidebar remains visible and stationary.
4. Click on the **Support** category.
   - **Expected**: The right content pane instantly switches to the Support settings. No full page reload occurs.

### Scenario 2: Mobile Single-Column Navigation (Master-Detail)
1. Use browser DevTools to toggle device emulation to a mobile viewport (e.g., iPhone 12/13), or shrink the browser window width below the `md` breakpoint (~900px).
2. Navigate directly to `/settings` (without any `?tab=` parameter).
   - **Expected**: A full-width vertical list of categories (the "Master" menu) is displayed.
   - **Expected**: The content pane is completely hidden.
3. Tap the **Account** category.
   - **Expected**: The URL updates to `?tab=account`.
   - **Expected**: The "Master" menu disappears. The Account Settings "Detail" panel is now displayed full-width.
4. Observe the top of the detail panel.
   - **Expected**: A "Back to Settings" button (with a left arrow icon) is visible at the top.
5. Tap the **Back to Settings** button.
   - **Expected**: The URL resets to `/settings` (or simply clears the tab parameter).
   - **Expected**: The Account Settings panel disappears, and the "Master" menu list is displayed again.
