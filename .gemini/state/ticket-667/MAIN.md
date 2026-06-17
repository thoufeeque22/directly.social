---
ticket_id: 667
branch_name: feature/667-modularize-schedulecontent
status: discovery
current_round: 1
---

# 📋 Ticket Metadata
- **ID**: 667
- **Branch**: `feature/667-modularize-schedulecontent`
- **Goal**: Refactor `src/app/schedule/ScheduleContent.tsx` by modularizing it into smaller components and extracting types/hooks.
- **Current Status**: discovery

# 📝 Ticket Description
### Context
The `src/app/schedule/ScheduleContent.tsx` file is a legacy module containing 621 lines of code, significantly exceeding the 100-line modularity limit defined in `CORE.md`.

### Problem/Goal
The file handles too many responsibilities: data fetching, state management for editing, multiple view modes (timeline, month, week), and AI content review integration. This makes maintenance difficult and violates architectural standards.

### Suggested Approach
Extract logic into smaller, focused modules:
1. **Types:** Move `PostActivityEntry` and `PlatformResult` to `src/app/schedule/types.ts`.
2. **Constants:** Move `PLATFORM_ICONS` to a dedicated constants file.
3. **Hooks:** Extract editing logic and polling state into a custom hook `useScheduleEditor.ts`.
4. **Sub-components:** Extract view implementations (Timeline, Month, Week) and the edit modal into separate components.
5. **Aesthetic:** Ensure sub-components utilize Material UI components and icons for a consistent, professional feel.

### Impact
Improves codebase maintainability, reduces cognitive load during reviews, and aligns the project with strict technical standards.

# 🔄 Round History
- **Round 1**: [IN-PROGRESS]

# 📅 Timeline
- **[2026-06-17 21:15:20]**: Ticket initialized.
- **[2026-06-17 23:20:51]**: PRODUCT [APPROVED] - Approved UX flow for ScheduleContent refactoring
