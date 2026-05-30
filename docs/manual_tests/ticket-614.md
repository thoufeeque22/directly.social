# Discovery Report: Ticket #614 - Activity Hub & Navigation Regressions

## Root Cause Analysis

### 1. Search Navigation & Data Visibility
- **Finding:** `useActivityState.ts` initializes `searchQuery` from `searchParams.get('search')` only on mount. It does not synchronize the state when the URL parameter changes via `router.push` (e.g., from the Header).
- **Impact:** Searching from the Header updates the URL, but the Activity Hub doesn't re-fetch data because its internal `searchQuery` state remains unchanged.
- **Root Cause:** Missing `useEffect` in `useActivityState.ts` to watch `searchParams`.

### 2. Pull-to-Refresh
- **Finding:** `LayoutWrapper.tsx` implements `react-simple-pull-to-refresh` wrapping `{children}`. 
- **Impact:** Fails on mobile emulators. Likely due to the `.ptr-container` not having a defined height or the content not triggering the scroll-at-top condition required by the library.
- **Root Cause:** CSS/Layout constraints on the PTR container.

### 3. Schedule Navigation (Mobile Safari)
- **Finding:** "View All" button is an MUI `IconButton` using `component={Link}` from `next/link` in `SidebarInfo.tsx`.
- **Impact:** Navigation fails specifically on Mobile Safari. WebKit can have issues with nested clickable elements or how `next/link` handles events on custom components.
- **Root Cause:** Event propagation or WebKit incompatibility with `IconButton` + `Link` combo.

## Technical Implementation Plan

### Fix 1: Search Sync
- Modify `src/hooks/useActivity/useActivityState.ts` to add a `useEffect` that updates `searchQuery` when `searchParams.get('search')` changes.
- Ensure `Header.tsx` input is accessible and triggers search correctly on mobile (check for virtual keyboard 'Go/Search' behavior).

### Fix 2: PTR Reliability
- Audit `src/app/globals.css` (or relevant module) for `.ptr-container` styles.
- Ensure `LayoutWrapper` content has `overflow-y: auto` if needed for PTR to detect scroll.

### Fix 3: Robust Navigation
- In `src/components/dashboard/SidebarInfo.tsx`, refactor the "View All" button to use a standard `Link` styled as a button, or ensure `IconButton` doesn't block navigation events on Safari.

## Definition of Done (DoD)
- [ ] Search from Header correctly filters Activity Hub on mobile.
- [ ] Pull-to-Refresh triggers successfully on mobile viewports.
- [ ] "View All" button navigates to `/schedule` on Mobile Safari.
- [ ] All related E2E tests (`header-search.spec.ts`, `refresh-mechanism.spec.ts`, `schedule-navigation.spec.ts`, `global-search.spec.ts`) pass.

## Next Steps
- Move to **Development** phase upon user approval.
