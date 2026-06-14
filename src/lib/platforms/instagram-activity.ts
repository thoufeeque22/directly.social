import { InstagramClient } from "./instagram/client";
import { 
  PlatformActivity, 
  VerificationParams, 
  InitiationParams, 
  PushParams, 
  PollingParams, 
  FinalizationParams 
} from "./types";

/**
 * (OO-003): Instagram implementation of PlatformActivity.
 * (CA-003): Uses InstagramClient for implementation details.
 */
export class InstagramActivity implements PlatformActivity {
  private client: InstagramClient;

  constructor(client = new InstagramClient()) {
    this.client = client;
  }

  async preVerify(params: VerificationParams): Promise<void> {
    await this.client.getAccount(params.userId, params.accountId);
  }

  async init(params: InitiationParams): Promise<{ creationId: string }> {
    const { igUserId, userAccessToken } = await this.client.getAccount(params.userId, params.accountId);
    const creationId = await this.client.createContainer(igUserId, userAccessToken, params.description);
    return { creationId };
  }

  async push(params: PushParams): Promise<{ resumableUrl?: string }> {
    const { userAccessToken } = await this.client.getAccount(params.userId, params.accountId);
    const startOffset = await this.client.fetchUploadOffset(params.creationId, userAccessToken);

    await this.client.pushBinary(
      params.creationId,
      params.filePath,
      userAccessToken,
      startOffset,
      params.onProgress
    );

    return { resumableUrl: `https://rupload.facebook.com/ig-api-upload/v20.0/${params.creationId}` };
  }

  async poll(params: PollingParams): Promise<void> {
    const { userAccessToken } = await this.client.getAccount(params.userId, params.accountId);
    await this.client.pollStatus(params.creationId, userAccessToken);
  }

  async finalize(params: FinalizationParams): Promise<{ id: string; permalink: string }> {
    const { igUserId, userAccessToken } = await this.client.getAccount(params.userId, params.accountId);
    const publishedMediaId = await this.client.finalize(igUserId, params.creationId, userAccessToken);
    const permalink = await this.client.getPermalink(publishedMediaId, userAccessToken);
    
    return { 
      id: publishedMediaId, 
      permalink: permalink || `https://www.instagram.com/reel/${publishedMediaId}/` 
    };
  }
}
