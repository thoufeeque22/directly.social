---
ticket_id: 648
branch_name: feature/648-post-versioning
status: qa
current_round: 2
---

# 📋 Ticket Metadata
- **ID**: 648
- **Branch**: `feature/648-post-versioning`
- **Goal**: Implement Post Versioning system for network-specific overrides for captions, hashtags, and scheduled time (skipping First Comment).
- **Current Status**: qa

# 📝 Ticket Description
### Context
Creators often need to tailor their content for different audiences (e.g., professional for LinkedIn, hype for TikTok) while using the same core video asset. Currently, our MVP treats posts as monolithic across all platforms.

### Goal
Implement a "Post Versioning" system (inspired by Mixpost) that allows a single master video to have network-specific overrides for captions, hashtags, and "First Comment" automation.

### Suggested Approach
1. **Schema Update:** Modify the `Post` and `PostPlatform` tables to support network-specific metadata overrides.
   - `MasterPost`: Contains the shared media asset.
   - `PostVersion`: (Child of MasterPost) Contains network-specific fields: `caption`, `hashtags`, `first_comment_text`, and `scheduled_at` (if different).
2. **Tabbed Composer UI:** In the `src/components/Composer`, implement a Material UI (MUI) `Tabs` component.
   - **Tab 1: Global**: Common settings for all.
   - **Tab 2+: Platform Specific**: Overrides for specific networks (TikTok, LinkedIn, etc.).
3. **Drafting Logic:** Allow users to "Sync All" from the Global tab or "Unlink" a specific platform to provide custom metadata.

### Impact
Reduces manual rework for creators who distribute the same video to multiple platforms, while maintaining platform-specific "vibe" and engagement (via First Comment).

### Technical Implementation Hint
- Use **Prisma's nested writes** to save all versions in a single transaction.
- Leverage **Zod** to validate platform-specific requirements (e.g., character limits for X/Twitter vs LinkedIn).

### Labels
`roadmap`, `feature`

# 🔄 Round History
- **Round 1**: [IN-PROGRESS]

# 📅 Timeline
- **[2026-06-17 00:00:00]**: Ticket initialized and branch created.
- **[2026-06-17 18:06:25]**: PRODUCT [APPROVED] - Defined UX strategy for multi-platform post versioning with a Global-First override model and tabbed UI.
- **[2026-06-17 18:07:50]**: DISCOVERY [APPROVED] - Designed the technical blueprint including Prisma schema updates, form context evolution for sync/unlink logic, and tabbed UI component architecture.
- **[2026-06-17 18:25:58]**: DEVELOPMENT [SUCCESS] - Implemented Post Versioning system with MUI tabs, sync/unlink logic, and Prisma schema updates.
- **[2026-06-17 18:27:23]**: AUDIT [FAIL] - Security passed, but Performance (memoization) and Modularity (100-line rule) violations found in DashboardClient.handlers.ts.
- **[2026-06-17 18:28:34]**: AUDIT [FAIL] - Audit failed due to performance issues in UploadFormContext and modularity violations in DashboardClient.handlers.ts.
- **[2026-06-17 18:34:56]**: DEVELOPMENT [SUCCESS] - Resolved performance and modularity failures from Round 1 by memoizing context and refactoring handlers.
- **[2026-06-17 18:37:34]**: AUDIT [PASS] - Verified performance fix via memoization and modularity via logic extraction. All files < 100 lines. Security and Hydration checks passed.
- **[2026-06-17 18:38:30]**: AUDIT [PASS] - Audit passed. Performance and modularity issues resolved.
