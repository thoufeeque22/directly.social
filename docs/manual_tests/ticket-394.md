# Manual Test Script: Dark/Light Mode Toggle (#394)

## Prerequisites
- Accessible account on the platform.
- Browser with support for `prefers-color-scheme` (Chrome, Safari, Firefox).

## Test Case 1: Initial State & System Sync
1. Open the application.
2. Verify the initial theme matches your OS preference (e.g., if OS is Dark, app should be Dark).
3. Change your OS theme preference.
4. Verify the app automatically switches to match the new OS preference (if set to "System" by default).

## Test Case 2: Manual Toggle
1. Locate the Sun/Moon icon in the Header.
2. Click the icon.
3. Verify the theme switches (e.g., Dark -> Light).
4. Verify all elements (background, text, cards, buttons) transition smoothly.
5. Verify MUI components (Modals, Dropdowns) follow the selected theme.

## Test Case 3: Persistence (Session)
1. Switch to a specific theme (e.g., Light).
2. Refresh the page (F5).
3. Verify the theme remains Light.
4. Navigate to different pages (/activity, /media, /settings).
5. Verify the theme remains Light across all pages.

## Test Case 4: Persistence (Cross-Device/Database)
1. Log in to your account.
2. Switch to a specific theme (e.g., Dark).
3. Log out and log back in, or log in from a different browser.
4. Verify the theme preference was saved to your profile and persists.

## Test Case 5: FOUC (Flash of Unstyled Content)
1. Set the theme to Light.
2. Hard refresh the page (Cmd+Shift+R or Ctrl+F5).
3. Observe the initial load carefully.
4. Verify there is no "flash" of dark mode before the light mode is applied.

## Acceptance Criteria
- [ ] Theme switches immediately on toggle.
- [ ] Theme persists after refresh.
- [ ] Theme persists across navigation.
- [ ] No visual artifacts or unreadable text in either mode.
- [ ] No flash of unstyled content on load.
