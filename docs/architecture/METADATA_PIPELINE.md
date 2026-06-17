# Post Versioning & Multi-Platform Overrides

The Post Versioning system allows creators to tailor their content for different social media audiences while using the same core media asset. This document explains the "Global-First" override model and the technical architecture supporting it.

## Overview
Currently, the Post Composer supports a **Global** context and individual **Platform** contexts. Users can write a single master caption and title that propagates to all platforms, or "unlink" specific platforms to provide precision overrides.

## The "Global-First" Override Model
1.  **Global Source of Truth**: Content entered in the "Global" tab acts as the default for all selected platforms.
2.  **Explicit Override**: Platforms are synced to Global by default. To customize a platform, the user must explicitly click "Customize for [Platform]".
3.  **Sync-on-Unlink**: When a platform is first customized, it is initialized with the current Global values to provide a starting point for tweaks.
4.  **Re-syncing**: Users can discard platform-specific overrides at any time by clicking "Reset to Global", which restores inheritance.

## Architecture

### 1. Database Schema
Overrides are stored in the `PostPlatformResult` table:
- `overrideTitle`: Platform-specific title.
- `overrideDescription`: Platform-specific description.
- `hashtags`: Platform-specific hashtags.
- `firstCommentText`: Text for automated first comment publication.
- `scheduledAt`: Platform-specific staggering (e.g., post to TikTok now, LinkedIn in 2 hours).

### 2. Frontend State (`UploadFormContext`)
The state is managed via a memoized context provider to ensure high-performance typing responsiveness.
- `overriddenPlatforms`: A list of platform IDs that have active overrides.
- `platformHashtags`, `platformFirstComments`, etc.: Records mapping platform IDs to their specific values.

### 3. Submission Flow
The `platformMapper` utility orchestrates the extraction of metadata from the multi-tab form:
- If a platform is marked as `overridden`, its specific values are extracted from `FormData`.
- If not, the Global values are used as the fallback.

## Testing
- **Automated**: `src/__tests__/e2e/ticket-648.spec.ts` covers sync inheritance, override isolation, and persistence.
- **Manual**: [docs/manual_tests/ticket-648.md](../manual_tests/ticket-648.md) provides a step-by-step verification guide.
