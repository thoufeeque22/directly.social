# Manual Test Script: Ticket 504 (ASO App Title)

## Goal
Verify that the App Store title has been updated to the new ASO-optimized title without breaking the main application's internal name.

## Pre-requisites
- Check out the `feature/504-aso-app-title` branch.
- Ensure the dev server is running (`pnpm dev`).

## Test Steps

### 1. Verify Configuration Object
1. Open the file `src/lib/core/brand.ts` in your code editor.
2. Verify that the `BRAND.name` property is still exactly `'directly.social'`.
3. Verify that `BRAND.appStore.apple.title` exists and is set to `'directly.social: Post Planner'`.
4. Verify that `BRAND.appStore.google.title` exists and is set to `'directly.social: Post Planner'`.

### 2. Verify UI Consistency
1. Open the application in your browser (`http://localhost:3000`).
2. Navigate to the main dashboard and the Sign In page.
3. Ensure that any headers or text referencing the app name still read "directly.social" and **not** the long "Post Planner" ASO title.

### 3. Verify Build Integrity
1. Run `pnpm run build` in the terminal.
2. Ensure the build completes without any TypeScript or Next.js configuration errors.
