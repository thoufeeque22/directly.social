# Ticket #365: AI Review 'Forward' Navigation

## Status
- [x] Discovery
- [x] Development
- [x] Review
- [x] QA
- [x] Documentation

## Requirements
- [x] Cache AI-generated titles and descriptions (titles/descriptions).
- [x] Introduce a "Forward" or "Resume Review" button in the step-based creation flow.
- [x] Button should only appear if valid AI previews exist in the cache.
- [x] Skip AI generation API call if cached data is relevant.
- [x] Invalidate cache if Step 1 input changes significantly.

## Discovery Notes
- Identified `DashboardClient` and `SchedulePage` as primary targets.
- Used `localStorage` for cross-session persistence of `aiPreviews`.
- Implemented `checkCacheValidity` utility for heuristic-based invalidation.

## Implementation Details
- Created `src/hooks/useAIPreviewCache.ts` to centralize cache management.
- Updated `UploadFormActions` to conditionally show "Resume Review" based on cache validity.
- Updated `SchedulePage` edit modal to support "Resume Review".
- Added `localStorage` tracking of the generation context (title, desc, platforms, tier, mode).
- Verified with `npm run build` and `npm run lint`.

## Plan
1. Research existing AI Review implementation.
2. Identify state management strategy for caching.
3. Implement caching logic.
4. Add "Resume Review" button.
5. Verify and Test.
