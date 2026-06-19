# Technical Specification: Dark/Light Mode Toggle (#394)

## 1. Overview
Implement a professional, persistent theme switching system for the Social Studio App. The system will support Light, Dark, and System (Auto) modes, ensuring visual consistency across both MUI components and global CSS variables.

## 2. Current State Analysis
- **Current Theme:** Primarily Dark-themed using custom HSL variables in `globals.css` and MUI theme configuration in `src/theme`.
- **Component State:** `DashboardClient` receives `initialAIStyleMode`, but this is specifically for AI generation styles, not the global UI theme.
- **Layout:** `Header` and `Sidebar` are the primary locations for a theme toggle.

## 3. Proposed Architectural Changes

### 3.1 Data Model (Database)
Update `prisma/schema.prisma`:
- Add `preferredTheme` field to the `User` model.
- Enum: `ThemePreference { LIGHT, DARK, SYSTEM }`.

### 3.2 Theme Infrastructure
- **`src/theme/index.ts`**: Refactor to a factory function `getTheme(mode: 'light' | 'dark')` that returns the appropriate MUI theme object.
- **`src/app/globals.css`**: Define a `.light-mode` class (or data-attribute) that overrides the default Dark mode HSL variables.
- **`src/components/ThemeContext.tsx`**: A new React Context to manage:
  - `theme`: current active theme ('light' | 'dark').
  - `preference`: user selection ('light' | 'dark' | 'system').
  - Persistence logic (LocalStorage + API calls to sync with DB).

### 3.3 Hydration & SSR
- Inject a blocking script in `src/app/layout.tsx` (before `<body>`) to detect system preference and apply the correct theme class to `<html>` or `<body>` to prevent "flash of unstyled content" (FOUC).

### 3.4 UI Components
- **`ThemeToggle`**: A button (likely in the Header) that cycles through Light -> Dark -> System. Uses MUI icons (`Brightness4`, `Brightness7`, `SettingsBrightness`).

## 4. Implementation Plan

### Phase 1: Infrastructure
1. Update Prisma schema and migrate.
2. Refactor `src/theme` to support dual modes.
3. Update `globals.css` with light-mode overrides.
4. Create `ThemeContext` and `ThemeProvider`.

### Phase 2: UI & Integration
1. Implement `ThemeToggle` component.
2. Integrate `ThemeToggle` into `Header`.
3. Add the FOUC-prevention script to `layout.tsx`.

### Phase 3: Persistence
1. Implement API route `/api/user/theme` to save preference.
2. Synchronize LocalStorage with DB on login.

## 5. Test Plan
- **Unit Tests:** Verify `getTheme` returns correct objects. Test `ThemeContext` state transitions.
- **E2E Tests:**
  - Verify theme persistence after page reload.
  - Verify system theme detection.
  - Check accessibility contrast ratios in both modes using Playwright/Axe.
- **Visual Regression:** Capture screenshots of primary views in both modes.
