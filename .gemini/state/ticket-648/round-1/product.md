
## [2026-06-17 18:06:25] Verdict: APPROVED
# Product Phase Report - Issue 648

## Verdict: APPROVED

## UX Strategy: Multi-Platform Post Versioning
Based on competitive benchmarks (Mixpost, Hootsuite) and the specific project needs, I am proposing a **Tab-based "Global-First" Override Model**. This approach maximizes speed for simple cross-posting while providing deep precision for power users.

### The "Global-First" Override Model
1.  **Global Source of Truth:** Users begin by writing in a "Global" tab. This content acts as the default for all selected platforms.
2.  **Implicit vs Explicit Override:** 
    - **Implicit:** If a user switches to a platform tab and starts typing, that platform is automatically "unlinked" from Global.
    - **Explicit:** A "Customize this post" button appears in the platform tab to unlock editing.
3.  **Visual Feedback:** Tabs will show a status indicator:
    - **Synced (Default):** No extra icon. Content matches Global.
    - **Overridden:** A small "edit" or "unlink" icon appears next to the platform name.
4.  **Re-syncing:** A clear "Reset to Global" button allows users to discard platform-specific tweaks and revert to the master content.

## Industry Standards
- **Hootsuite-style Tabs:** Provides the best isolation for platform-specific character limits and validation errors.
- **Mixpost-style Syncing:** Ensures that a change to the "Global" caption doesn't require manual updates to 5 other platforms unless they were specifically customized.

## UI Layout
- **Component:** `PostComposerTabs` (MUI Tabs)
- **Placement:** Replaces the current `PlatformSpecificToggle` and `PlatformMetadataFields` vertical list.
- **Tab Order:** `Global` (fixed first) -> `Platform 1` -> `Platform 2` -> ...
- **Field Persistence:** Even if a platform is unselected, its "overridden" state should be preserved in the form context in case it is re-selected.

## Platform Specifics to Support
- **Caption/Description:** Core override.
- **Hashtags:** Often different for LinkedIn vs TikTok.
- **Scheduled Time:** Ability to stagger posts (e.g., 9 AM TikTok, 11 AM LinkedIn).
- **First Comment:** Placeholder for future implementation (as requested, we will skip implementation but keep schema support).

## Next Step: Invoke `discovery-agent` for technical planning.
The Discovery agent should focus on the Schema update (Prisma) and how the `UploadFormContext` needs to evolve to support unlinking logic.
