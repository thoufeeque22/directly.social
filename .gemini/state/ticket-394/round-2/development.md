# Development Phase - Round 2

## Theme Consistency & 3-Way Toggle

### Goals
- Fix visual inconsistencies in light mode (dark sidebar/header).
- Upgrade theme toggle to a 3-way cycle: Light -> Dark -> System.
- Ensure all components use theme-aware CSS variables.

### Implementation Details
- **Sidebar & Header:** Updated `.module.css` files to use `--card`, `--background`, and `--border` variables instead of hardcoded dark colors.
- **Settings & Activity Pages:** Refactored platform cards, timelines, and pills to use variables for colors, borders, and shadows.
- **3-Way Toggle:**
  - Updated `ThemeContext.tsx` and `ThemeContextProvider.tsx` to include `system` mode in the toggle logic.
  - Updated `ThemeToggle.tsx` with new icons (`DarkMode`, `SettingsBrightness`, `WbSunny`) and tooltips.
  - Maintained persistence to `localStorage` and database via server actions.
- **Linter Compliance:** Fixed `max-lines` violation in `ThemeContextProvider.tsx` and updated `ThemeToggle.tsx` to be more modular.

### Verification Results
- `npm run lint`: Passed (resolved file length issues).
- `npm run build`: Passed.
- Visual inspection: Sidebar and Header now correctly adapt to light mode colors. Theme toggle successfully cycles through all three states with appropriate icon updates.

### File Changes
- `src/components/layout/Sidebar.module.css`
- `src/components/layout/Header.module.css`
- `src/app/settings/Settings.module.css`
- `src/app/activity/activity.module.css`
- `src/components/WhatsNew/WhatsNewActivityList.tsx`
- `src/components/WhatsNew/WhatsNewList.tsx`
- `src/components/ThemeContextProvider.tsx`
- `src/components/layout/ThemeToggle.tsx`
