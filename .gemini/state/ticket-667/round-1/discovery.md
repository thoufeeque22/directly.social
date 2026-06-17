
## [2026-06-17 23:41:52] Verdict: APPROVED
**VERDICT:** APPROVED
**SOCRATIC_LOG:** 
- Analyzed `src/app/schedule/ScheduleContent.tsx` (622 lines). It violates the 100-line modularity rule defined in `CORE.md`.
- Identified that `CalendarView.tsx` already lives in `src/components/schedule/`. To maintain consistency, new sub-components (Header, Timeline, Edit Modal) should also be placed there.
- Checked `src/hooks/` and found it's the standard location for custom hooks, so `useScheduleEditor.ts` will be created there.
- The requirements are clear, technically feasible, and perfectly align with the architectural standards. No further clarification is needed.

**TECHNICAL SPECS:**

1. **Extract Types (`src/app/schedule/types.ts`)**
   - Move `PostActivityEntry` and `PlatformResult` interfaces from `ScheduleContent.tsx`.
   - Export these types for use across the new modular components.

2. **Extract Constants (`src/app/schedule/constants.ts`)**
   - Move the `PLATFORM_ICONS` dictionary.
   - Ensure MUI icons (`YouTubeIcon`, `InstagramIcon`, etc.) are imported in this file.

3. **Extract Hook (`src/hooks/useScheduleEditor.ts`)**
   - Create a new custom hook to encapsulate the heavy state and logic from `ScheduleContent.tsx`.
   - **State to extract:** `posts`, `isLoading`, `editingPost`, `isSaving`, `isReviewing`, `isAILoading`, `viewMode`, `currentDate`.
   - **Actions to extract:** `fetchSchedule` (and its polling wrapper), `nextPeriod`, `prevPeriod`, `goToToday`, `handleUpdate`, `handleDelete`, `handlePublishNow`, `handleAIBrainstorm`, `handleConfirmReview`.
   - Return a structured object containing the state and handlers for the UI.

4. **Extract View Components (`src/components/schedule/`)**
   - **`ScheduleHeader.tsx`**: Extracts the top header, including the View Mode toggles (Timeline, Month, Week) and date navigation controls. Accepts props like `viewMode`, `currentDate`, `onNext`, `onPrev`, `onToday`, `onViewChange`.
   - **`ScheduleTimelineView.tsx`**: Extracts the timeline rendering logic (the `posts.map` loop). Accepts `posts`, `targetId`, and action callbacks (`onEdit`, `onDelete`, `onPublish`).
   - **`ScheduleEditModal.tsx`**: Extracts the "Edit Scheduled Post" and "AIContentReview" modal overlay. Accepts `editingPost`, `isSaving`, `isReviewing`, and the associated save/cancel/brainstorm handlers.
   - **`ScheduleEmptyState.tsx`**: Extracts the `GlassCard` that renders when `posts.length === 0`.

5. **Refactor `ScheduleContent.tsx`**
   - Strip out all the logic and inline JSX.
   - Import the newly created types, hook, and components.
   - Act purely as an orchestrator, bridging the data from `useScheduleEditor()` into the `ScheduleHeader`, conditional views (`ScheduleTimelineView` / `CalendarView` / `ScheduleEmptyState`), and `ScheduleEditModal`.

**TEST SPECIFICATION:**

- **Happy Path:**
  - Load the schedule page; verify `fetchSchedule` runs and `ScheduleTimelineView` correctly lists upcoming posts.
  - Toggle between Timeline, Month, and Week views; ensure `ScheduleHeader` updates `currentDate` and API is queried correctly.
  - Click "Edit" on a timeline item; verify `ScheduleEditModal` opens. Change the text, click Save, and ensure the modal closes and the timeline updates.
  - Click "Publish Now" on an item; verify it transitions to a published state and disappears from the scheduled queue.
- **Edge Cases:**
  - Test the schedule page for an account with 0 posts; verify `ScheduleEmptyState` renders neatly instead of an empty timeline.
  - Test AI brainstorming in the Edit Modal; verify cache validity logic accurately restores sessions or triggers new ones without freezing.
- **Negative Scenarios:**
  - Simulate a slow network response on edit save; ensure `isSaving` disables the save button to prevent duplicate submissions.
  - Simulate a failed fetch response; ensure the UI recovers or stays in a graceful state without completely crashing the page.
