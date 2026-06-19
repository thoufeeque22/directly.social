# Development Phase: Round 4 (E2E Test Fixes)

## Objective
Fix the remaining failures in the `MediaLibrary` Playwright E2E tests that were caused by UI refactoring, race conditions in parallel execution, backend deduplication, and strict mode violations.

## Changes Implemented

1. **Test IDs Added**: 
   - Added `data-testid="media-asset-card"` to `MediaAssetCard.tsx` so Playwright can correctly select the cards.
2. **Race Condition Fixed (Upload Assembly)**:
   - Updated `staging-service.ts` to append `crypto.randomUUID()` to the internal `uploadId`. This ensures that parallel E2E tests uploading simultaneously do not conflict on the same temporary directories or IDs.
3. **Backend Deduplication Bypassed**:
   - `gallery-registration.ts` uses SHA-256 deduplication. Running tests sequentially with the same mock video caused the backend to `upsert` rather than create new gallery items. Fixed by generating a unique buffer (`<!-- unique_${Date.now()}_${i} -->`) dynamically inside `uploadAssets` within `src/__tests__/e2e/media-library.spec.ts`.
4. **Flaky Loading State Mitigated**:
   - The UI displays a circular progress indicator (`.MuiCircularProgress-root`) during initial load. The `test.beforeEach` cleanup step was being skipped because the clear gallery button hadn't rendered yet. Added a wait for the progress root to hide before finding the "Clear Gallery" button.
5. **Strict Mode Violations Fixed**:
   - Changed `page.getByRole('button', { name: 'Delete' }).click()` to `page.getByRole('button', { name: 'Delete Selected' }).click()` to distinguish the bulk delete button from individual asset delete buttons.
   - Used `page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()` to target dialog buttons directly.
   - Updated the card click selector in the selection test to explicitly click `.getByRole('checkbox')` instead of the outer container.
6. **Search Field & Text Corrections**:
   - Updated the search placeholder selector to `'Search your library...'` to avoid targeting the global search header banner.
   - Updated search term from `'window'` to `'mock_video'` to match dynamically generated mock file names.
   - Updated regex `/\d+m remaining/` to `/\d+[dh] \d+[hm] remaining/` to correctly match output from `useTimeInfo.ts`.

## Verification
- Run `npx playwright test src/__tests__/e2e/media-library.spec.ts --project=chromium`.
- Status: **PASS (10/10)**.

## Next Steps
Proceed to QA phase or user sign-off for commit.
