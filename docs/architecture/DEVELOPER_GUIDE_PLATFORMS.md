# Developer Guide: Adding New Publishing Platforms

This guide outlines the steps required to add support for a new social media platform to the durable publishing workflow.

## 1. Implement the `PlatformActivity` Interface

Create a new class in `src/lib/platforms/` (e.g., `src/lib/platforms/tiktok-activity.ts`) that implements the `PlatformActivity` interface:

```typescript
import { 
  PlatformActivity, 
  VerificationParams, 
  InitiationParams, 
  PushParams, 
  PollingParams, 
  FinalizationParams 
} from "./types";

export class TikTokActivity implements PlatformActivity {
  async preVerify(params: VerificationParams): Promise<void> {
    // 1. Validate account and permissions
  }

  async init(params: InitiationParams): Promise<{ creationId: string; resumableUrl?: string }> {
    // 2. Initialize upload session
    return { creationId: '...' };
  }

  async push(params: PushParams): Promise<{ resumableUrl?: string; platformPostId?: string }> {
    // 3. Perform binary upload (use params.onProgress for tracking)
    return { platformPostId: '...' };
  }

  async poll(params: PollingParams): Promise<void> {
    // 4. Poll platform for processing status
  }

  async finalize(params: FinalizationParams): Promise<{ id: string; permalink: string }> {
    // 5. Final publish and fetch permalink
    return { id: '...', permalink: '...' };
  }
}
```

## 2. Register the Activity

Add your new activity to the `ActivityRegistry` in `src/lib/platforms/factory.ts`:

```typescript
// ... existing imports
import { TikTokActivity } from "./tiktok-activity";

// Register default platforms
ActivityRegistry.register('instagram', new InstagramActivity());
ActivityRegistry.register('youtube', new YouTubeActivity());
ActivityRegistry.register('tiktok', new TikTokActivity()); // Add this line
```

## 3. Infrastructure Considerations

- **Storage**: Use the `storage` parameter (of type `StorageProvider`) in `init` and `push` to resolve file paths or sizes.
- **Resumability**: Store necessary URLs in the `resumableUrl` field during `init` and `push` to allow the workflow to resume after a failure.
- **Throttling**: The core workflow automatically throttles progress updates. Do not implement local throttling in the activity itself.

## 4. Testing

Create a unit test for your new activity in `src/__tests__/unit/lib/platforms/[platform]-activity.test.ts` following the pattern in `instagram-activity.test.ts`.
