# Metadata Pipeline Architecture

This document describes the flow of content metadata (titles, descriptions, hashtags) from user input in the dashboard to final distribution via platform APIs.

## 1. Metadata Capture (`src/components/dashboard/UploadForm`)

The `UploadForm` uses a modular state management system to capture both global and platform-specific metadata.

### State Structure (`UploadFormContext.types.ts`)
Metadata is stored in a unified format:
- `title`: Global title fallback.
- `description`: Global description fallback.
- `platformTitles`: Record mapping `platformId` to a specific title.
- `platformDescriptions`: Record mapping `platformId` to a specific description.
- `isPlatformSpecific`: Boolean flag to toggle between global and granular modes.

### UI Components
- **`PlatformMetadataFields.tsx`**: Orchestrates fields for all selected platforms.
- **`PlatformMetadataItem.Title.tsx` / `Description.tsx`**: Modularized input fields with "Clear" and "Undo" functionality.

## 2. Activity Hub Persistence

When a post is submitted, metadata is persisted in the `Activity` record. 
- If `isPlatformSpecific` is active, the specific metadata is stored in the `ActivityPlatformResult` records or as a JSON blob in the `Activity` record depending on the workflow phase (Manual vs. AI).
- **Title Promotion Logic**: In the Activity Hub UI (`src/app/activity/`), if the global title is missing, the UI promotes the first available platform-specific title to the card header to ensure a meaningful display instead of a date fallback.

## 3. Server-Side Distribution (`src/lib/worker/server-distributor.ts`)

The `server-distributor` is a lean orchestrator that manages the distribution process.

### Metadata Resolution (`server-distributor.logic.ts`)
The `preparePlatformMetadata` function implements the following priority:
1. **Reviewed Content**: If AI-reviewed content is provided, it takes precedence.
2. **Platform-Specific Metadata**: If existing metadata is found for the specific platform/account, it is used.
3. **Global Metadata**: Defaults to the global title/description.

### Modularity (100-Line Rule)
To maintain maintainability, the distributor is split into:
- **`server-distributor.ts`**: Orchestration logic.
- **`server-distributor.db.ts`**: Prisma/DB operations (upserting results, tracking progress).
- **`server-distributor.logic.ts`**: Business logic (metadata preparation, file path resolution).

## 4. Platform-Specific Delivery

The resolved metadata is passed to the modular platform drivers (`src/lib/platforms/`), which sanitize and truncate the strings according to platform-specific limits (e.g., 100 chars for YouTube titles, 2200 for Instagram captions).
