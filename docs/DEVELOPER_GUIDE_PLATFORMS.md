# Developer Guide: Adding a New Platform

This guide outlines the process for integrating a new social media platform into Social Studio using the modular distribution architecture.

## Architecture Overview

Social Studio uses a modular pattern for platform distribution to ensure code maintainability and separation of concerns.

- **Shared Core:** `src/lib/core/platforms/` contains utilities like account resolution and Meta-specific uploaders.
- **Platform Modules:** `src/lib/platforms/[platform-name]/` contains the granular logic for a specific platform.
- **Orchestrator:** `src/lib/platforms/[platform-name].ts` provides the high-level API used by the rest of the system.

## Step-by-Step Implementation

### 1. Define Types

If your platform requires specific parameters not covered by `PublishParams` in `src/lib/core/platforms/types.ts`, add them to that file.

### 2. Create the Platform Directory

Create a new directory: `src/lib/platforms/[platform]/`.

Inside this directory, implement the following (as applicable):

- **`account.ts`**: Use `getPlatformAccount` from `@/lib/core/platforms/account-utils` to retrieve the user's credentials and perform any platform-specific account resolution.
- **`stats.ts`**: Implement a function to fetch analytics/engagement data.
- **`publish.ts`** (or granular files like `video.ts`, `reel.ts`): Implement the platform-specific API calls for uploading and publishing content.

### 2.5 Implement Token Refresh (If Applicable)

If the platform uses OAuth tokens that expire, implement a refresh function in `src/lib/auth/providers/[platform].ts` and register it in `src/lib/auth/token-refresher.ts`. This ensures the background worker can proactively rotate tokens before publishing.

### 3. Create the Orchestrator

Create `src/lib/platforms/[platform].ts`. This file should:
1. Import modular functions from the subdirectory.
2. Export high-level functions like `publish[Platform]Video`.
3. Handle the orchestration of steps (e.g., Get Account -> Initialize Upload -> Push Binary -> Poll Status -> Finalize).

**Example Template:**
```typescript
import { getPlatformAccount } from "@/lib/core/platforms/account-utils";
import { uploadFile } from "./[platform]/publish";
// ... other imports

export const publish[Platform]Video = async ({ userId, filePath, title, description, accountId, onProgress }) => {
  const account = await getPlatformAccount(userId, "[platform-name]", accountId);
  
  // 1. Initialize
  // 2. Upload
  // 3. Finalize
  
  return { id: "platform-id", permalink: "..." };
};
```

### 4. Register with the Distributor

Update `src/lib/core/distributor-server.ts` to include your new platform in the `distributeSinglePlatform` function.

```typescript
if (platform === '[platform-name]') {
  const { publish[Platform]Video } = await import('@/lib/platforms/[platform-name]');
  return await publish[Platform]Video({
    userId,
    filePath,
    title,
    description: finalCaption,
    accountId,
    onProgress: progressCallback
  });
}
```

## Best Practices

- **Strict TypeScript:** Ensure all functions are typed and avoid `any`. Use interfaces from `src/lib/core/platforms/types.ts`.
- **Modular Logic:** Keep files under 50 lines. Extract complex API logic into separate utility files within the platform directory.
- **Error Handling:** Wrap API calls in try-catch blocks and throw descriptive errors. Use the platform's error messages where possible.
- **Logging:** Use the centralized `logger` from `@/lib/core/logger` to track the distribution process.
- **Shared Utilities:** Check `src/lib/core/platforms/` for existing utilities (especially for Meta-based platforms) before implementing new ones.
