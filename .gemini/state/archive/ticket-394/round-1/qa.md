# QA: Round 1 (#394)

## Verdict: [PASS]

## Test Scenarios Covered

### 1. Unit Tests (`src/__tests__/unit/theme-logic.test.ts`)
- **Palette Logic**: Verified `getPalette` returns correct colors for 'light' and 'dark'.
- **Theme Factory**: Verified `getTheme` applies correct MUI palette mode and component overrides (e.g., dynamic borders).
- **Result**: PASS (4/4 tests).

### 2. E2E Tests (`src/__tests__/e2e/theme-toggle.spec.ts`)
- **Toggle Flow**: Verified clicking the toggle switches the `html` class and body background color.
- **Persistence (Reload)**: Verified theme preference persists in `localStorage` and is reapplied after page refresh.
- **Persistence (Navigation)**: Verified theme remains consistent when moving between different routes.
- **System Preference**: Verified the app correctly follows OS-level color scheme changes when set to "system".
- **FOUC Prevention**: Verified the blocking script applies the theme class before initial paint/hydration.
- **Multi-Device Emulation**: Verified functionality on Chromium (Desktop), Mobile Chrome (Pixel 5), and Mobile Safari (iPhone 13).
- **Result**: PASS (16/16 tests).

### 3. Regression Testing
- Ran all existing E2E tests to ensure theme changes didn't break layout or functionality for other features.
- **Result**: PASS.

## Failed Tests
None.

## Manual Test Script
Created at: `docs/manual_tests/ticket-394.md`

## Observations
- **Database Sync**: The DB schema was updated via `npx prisma db push` to support the `preferredTheme` field.
- **Transition Smoothness**: Transitions were temporarily disabled during E2E testing to ensure stable assertions, but verified manually to be smooth (0.3s).
- **Compliance**: No emojis in test code or documentation. Metric/PLN units not applicable but English language strictly used.
