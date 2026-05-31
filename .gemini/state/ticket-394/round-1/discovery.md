# Discovery: Dark/Light Mode Toggle (#394)

## VERDICT: [APPROVED]

## SOCRATIC_LOG

1. **Feasibility:** High. MUI has native support for theme modes. Persistence via Database (Prisma) and LocalStorage is straightforward. Next.js 15 handles client-side state well, though SSR flickering needs a "script in head" or "cookie" strategy for the most professional feel.
2. **Strategic Alignment:** High. Dark/Light mode is a standard UX expectation for modern dashboards.
3. **Architectural Integrity:** We will implement a `ColorModeContext` that manages both MUI's `ThemeProvider` and global CSS variables via a class on the `html` element.
4. **Necessity/Priority:** High. Improves accessibility and user comfort.
5. **External Dependencies & Cost:** Zero cost. No new dependencies.

## TECHNICAL SPECS

### 1. Database Schema
Add `preferredTheme` to the `User` model in `prisma/schema.prisma`.
```prisma
enum Theme {
  LIGHT
  DARK
  SYSTEM
}

model User {
  // ...
  preferredTheme Theme @default(SYSTEM)
}
```

### 2. Theme Configuration (`src/theme/index.ts`)
Refactor to support dynamic creation:
- Export a function `getTheme(mode: 'light' | 'dark')`.
- Define both light and dark palettes.
- Ensure MUI palette matches `globals.css` variables.

### 3. CSS Variables (`src/app/globals.css`)
- Define `:root` (dark by default or as current).
- Define `.light-mode` class with overridden variables.
- Add `transition: background-color 0.3s, color 0.3s` to `body` and `.glass-card`.

### 4. Theme Context (`src/components/ThemeContext.tsx`)
- Context to provide `mode`, `toggleColorMode`, and `setMode`.
- Handle `window.matchMedia` for 'system' preference.
- Sync state with LocalStorage and (optionally) call Server Action for DB sync.

### 5. Server Actions (`src/app/actions/user.ts`)
- `getThemePreference()`: Fetch from DB.
- `updateThemePreference(theme: 'LIGHT' | 'DARK' | 'SYSTEM')`: Save to DB.

### 6. UI Toggle Component
- New `ThemeToggle` component in `src/components/layout/`.
- Use MUI `IconButton` with `WbSunny` and `DarkMode` icons.
- Place in `src/components/layout/Header.tsx` or `UserActions.tsx`.

### 7. Hydration & Flickering
- Use a small script in `src/app/layout.tsx` (before `<body>`) to apply the theme class to `<html>` based on LocalStorage or System preference to avoid the white flash.

## TEST SPECIFICATION

### Happy Path
- **Toggle Action:** Clicking the toggle switches the entire UI (MUI components + CSS variable based elements).
- **Persistence:** Refreshing the page maintains the last chosen theme.
- **System Sync:** If 'System' is selected, changing OS theme updates the app theme instantly.

### Edge Cases
- **Guest Mode:** If no session exists, the theme should still work using LocalStorage.
- **Login/Logout:** On login, the theme should sync with the user's DB preference.
- **Mobile Emulation:** Test transitions on mobile viewports (Chrome/Safari).

### Negative Scenarios
- **Storage Denied:** If LocalStorage is blocked, the theme should default to 'System' or 'Dark' gracefully.
- **DB Failure:** If the server action fails, the UI should still toggle and save to LocalStorage as a fallback.
