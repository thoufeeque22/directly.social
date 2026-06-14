import { 
  PlatformActivity, 
  VerificationParams, 
  InitiationParams, 
  PushParams, 
  PollingParams, 
  FinalizationParams 
} from "./types";
import { getTikTokAccount } from "./tiktok/account";
import { initTikTokPublish, pushTikTokBinary } from "./tiktok/publish";
/**
 * (OO-003): TikTok implementation of PlatformActivity.
 * (CA-003): Uses specialized TikTok functions for stage execution.
 */
export class TikTokActivity implements PlatformActivity {
  async preVerify(params: VerificationParams): Promise<void> {
    await getTikTokAccount(params.userId, params.accountId);
  }

  async init(params: InitiationParams): Promise<{ creationId: string; resumableUrl: string }> {
    const account = await getTikTokAccount(params.userId, params.accountId);
    const fileSize = await params.storage.getFileSize(params.filePath);
    
    const { upload_url, publish_id } = await initTikTokPublish(
      account.access_token!, 
      fileSize, 
      params.title || params.description || "", 
      "SELF_ONLY" // Default to self-only for safety
    );

    return { creationId: publish_id, resumableUrl: upload_url };
  }

  async push(params: PushParams): Promise<{ resumableUrl?: string }> {
    const fileSize = await params.storage.getFileSize(params.filePath);
    
    // TikTok's current implementation doesn't easily support resuming mid-file in the pushTikTokBinary utility,
    // but the orchestration allows for it if we refactor pushTikTokBinary later.
    if (params.resumableUrl) {
      await pushTikTokBinary(params.resumableUrl, params.filePath, fileSize);
    }

    return { resumableUrl: params.resumableUrl };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async poll(params: PollingParams): Promise<void> {
    // TikTok doesn't have a specific poll in the current SDK implementation.
  }

  async finalize(params: FinalizationParams): Promise<{ id: string; permalink: string }> {
    return { 
      id: params.creationId, 
      permalink: `https://www.tiktok.com/` // Placeholder
    };
  }
}
