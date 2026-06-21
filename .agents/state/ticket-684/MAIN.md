---
ticket_id: 684
branch_name: feature/684-byos-media-library-tab
status: discovery
current_round: 1
---

# 📋 Ticket Metadata
- **ID**: 684
- **Branch**: `feature/684-byos-media-library-tab`
- **Goal**: Implement Bring Your Own Storage (BYOS) S3/R2 bucket integration in the Media Library tab.
- **Current Status**: in-progress

# 📝 Ticket Description
## 2026-06-21T14:18:47+02:00

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Add a new tab to the Media Library that displays a user's configured S3/R2 bucket contents, integrating both app-uploaded DB records and externally uploaded objects.

Working directory: /Users/thoufeeque/projects/social-studio-app
Integrity mode: benchmark

## Requirements

### R1. Conditional Tab Visibility
The Media Library UI must include a new tab (e.g. "My Cloud") that is only visible when the user has a saved Bring Your Own Storage (BYOS) configuration.

### R2. Unified Asset Display and Pagination
The new tab must display a paginated list of all video assets in the user's configured S3/R2 bucket. This list must merge assets previously uploaded via the app (which have DB records) and assets uploaded externally (discovered via S3 API).

### R3. Seamless Posting Flow
The UI must allow the user to select any asset from this new tab and draft a new post using it, matching the existing flow of the "Local" tab.

### R4. Workspace Segregation
Assets fetched from the BYOS bucket must be filtered out of the existing "Workspace" tab so that the two tabs show non-overlapping sets of media.

## Acceptance Criteria

### Functionality & Verification
- [ ] A programmatic test (existing or newly written) successfully verifies that the new tab is hidden when BYOS is unconfigured and visible when configured.
- [ ] A programmatic test successfully verifies that the backend merges DB-recorded assets and external bucket objects.
- [ ] Selecting an external bucket object seamlessly transitions to the drafting flow, registering it in the DB if necessary.
- [ ] The "Workspace" tab is verified to no longer list assets originating from the BYOS bucket.
- [ ] All related tests pass objectively without human intervention.

# 🔄 Round History
- **Round 1**: [IN-PROGRESS]

# 📅 Timeline
- **[2026-06-21 14:20:00]**: INITIALIZATION - Setup state directory and synchronized with main branch.
- **[2026-06-21 16:38:11]**: PRODUCT [APPROVED] - Optimal UX flow and UI layout for S3/R2 integration in Media Library spec'd and approved.
- **[2026-06-21 14:51:00]**: Discovery started by `discovery-agent`.

