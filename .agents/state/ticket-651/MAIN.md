---
ticket_id: 651
branch_name: feature/651-local-filesystem-vault
status: development
current_round: 1
---

# 📋 Ticket Metadata
- **ID**: 651
- **Branch**: `feature/651-local-filesystem-vault`
- **Goal**: Implement a Local FileSystem Vault for Directly Social to read and publish media assets directly from device storage.
- **Current Status**: development

# 📝 Ticket Description
### Context
Our marketing emphasizes a "Local-First" approach and a "Local Vault." Currently, the application supports **BYOS (Bring Your Own Storage)** via cloud buckets (S3/R2), but it does not yet allow users to use their **actual local hard drive** as the primary media source.

### Goal
Implement a true **Local FileSystem Vault** that allows Directly Social to read and publish media assets directly from the user's device storage, without requiring a cloud intermediary.

### Suggested Approach
1.  **Web/Desktop (FileSystem Access API)**:
    *   Implement a "Local Vault" connector that uses the modern `window.showDirectoryPicker()` to request persistent access to a user-defined folder.
    *   Store the directory handle in IndexedDB for subsequent sessions.
2.  **Mobile (Capacitor Filesystem Plugin)**:
    *   Leverage `Capacitor.Plugins.Filesystem` to browse and select files from the device's native Gallery or specific app-scoped directories.
3.  **Local Media Serving**:
    *   Create a local blob-URL or temporary streaming bridge to display local videos in the Gallery/Composer without uploading them to a central server.
4.  **Publishing Bridge**:
    *   Update the publishing pipeline to read the local file stream and pipe it directly to the platform API (YouTube/TikTok/Meta) via the client's device IP.

### Impact
This fulfills the "No SaaS Tax" and "Total Privacy" promise by allowing users to manage their entire social media workflow with $0 infrastructure costs and 0% data exposure to third-party cloud storage providers.

### Labels
`roadmap`, `feature`, `core`

# 🔄 Round History
- **Round 1**: [IN-PROGRESS]

# 📅 Timeline
- **[2026-06-20 19:29:27]**: State initialized by Project Orchestrator.
- **[2026-06-20 19:30:47]**: PRODUCT [APPROVED] - Defined UX strategy and UI layout for Local FileSystem Vault
- **[2026-06-20 19:30:59]**: PRODUCT [APPROVED] - Defined UX strategy and UI layout for Local FileSystem Vault
- **[2026-06-20 19:35:04]**: DISCOVERY [APPROVED] - Created technical blueprint and test specification for Local FileSystem Vault
- **[2026-06-20 20:10:00]**: DEVELOPMENT [RESUMED] - Resumed Development phase after subagent halt/crash recovery.
- **[2026-06-20 20:17:12]**: DEV [SUCCESS] - Implemented Local FileSystem Vault and verified all builds, lints, and type checks pass
- **[2026-06-20 20:25:32]**: QA [PASS] - QA Phase complete. Playwright E2E tests for Local Vault executed (9 passed). Manual test script formalized and documented. All Discovery blueprint scenarios verified with robust coverage.
