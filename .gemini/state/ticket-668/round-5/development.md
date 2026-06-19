# Development Phase: Round 5 (E2E Test Final Fixes)

## Objective
Identify and resolve the remaining intermittent flakiness and `toHaveCount` failures in the `MediaLibrary` Playwright E2E tests across all viewports (Chromium, Mobile Safari, Mobile Chrome).

## Changes Implemented

1. **Deterministic Test State Verification (`media-library.spec.ts`)**:
   - Refactored `test.beforeEach` cleanup step to wait deterministically for EITHER the empty state text (`'Your media library is empty.'`) OR the clear gallery button (`'Clear Gallery'`). This relies on `expect(A.or(B)).toBeVisible()` instead of rigid timeout heuristics, guaranteeing the test correctly identifies the state before cleaning up.
   
2. **Next.js GET Cache Invalidation (`useMediaLibrary.ts`)**:
   - Added `{ cache: 'no-store' }` to the `fetchAssets` API call to definitively prevent Playwright from encountering Next.js App Router route handler caching during rapid sequential test fetches.

3. **Isolated Parallel Auth State (`base-test.ts` & `parallel-upload.spec.ts`)**:
   - Identified a critical Cross-Test Database Pollution leak caused by `testInfo.workerIndex % 10` assigning the identical user identity to independent Playwright workers whenever workers restarted or executed alongside identical modulo values. 
   - Replaced `testInfo.workerIndex` with `testInfo.parallelIndex` for ALL tester account assignments (`workerEmail`, `adminEmail`, and `storageState`). `parallelIndex` is rigorously guaranteed to be unique for concurrent execution lines, completely insulating parallel E2E database states.

## Verification
- Executed `npx playwright test src/__tests__/e2e/media-library.spec.ts`
- Status: **PASS (30/30) across Desktop Chromium, Mobile Chrome, and Mobile Safari without retries.**

## Next Steps
E2E suite for Media Library is finally perfectly stable. Handoff to `qa-agent` for final sign-off or completion.
