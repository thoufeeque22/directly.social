import { 
  PlatformActivity, 
  VerificationParams, 
  InitiationParams, 
  PushParams, 
  PollingParams, 
  FinalizationParams 
} from "./types";
import { getFacebookPageAccount } from "./facebook/account";
import { initFacebookReel, finalizeFacebookReel } from "./facebook/reel";
import { pushBinaryToMeta, fetchMetaUploadOffset } from "@/lib/core/platforms/meta-uploader";
import { pollMetaStatus } from "@/lib/core/platforms/meta-utils";

/**
 * (OO-003): Facebook implementation of PlatformActivity.
 */
export class FacebookActivity implements PlatformActivity {
  async preVerify(params: VerificationParams): Promise<void> {
    await getFacebookPageAccount(params.userId, params.accountId);
  }

  async init(params: InitiationParams): Promise<{ creationId: string }> {
    const { pageId, pageAccessToken } = await getFacebookPageAccount(params.userId, params.accountId);
    const videoId = await initFacebookReel(pageId, pageAccessToken);
    return { creationId: videoId };
  }

  async push(params: PushParams): Promise<{ resumableUrl: string }> {
    const { pageAccessToken } = await getFacebookPageAccount(params.userId, params.accountId);
    const uploadUrl = `https://rupload.facebook.com/video-upload/v22.0/${params.creationId}`;

    const startOffset = await fetchMetaUploadOffset(uploadUrl, pageAccessToken);

    await pushBinaryToMeta({
      filePath: params.filePath,
      uploadUrl,
      accessToken: pageAccessToken,
      onProgress: params.onProgress,
      startOffset,
    });

    return { resumableUrl: uploadUrl };
  }

  async poll(params: PollingParams): Promise<void> {
    const { pageAccessToken } = await getFacebookPageAccount(params.userId, params.accountId);
    const statusUrl = `https://graph.facebook.com/v20.0/${params.creationId}?fields=status&access_token=${pageAccessToken}`;
    await pollMetaStatus(statusUrl);
  }

  async finalize(params: FinalizationParams): Promise<{ id: string; permalink: string }> {
    const { pageId, pageAccessToken } = await getFacebookPageAccount(params.userId, params.accountId);
    // Note: description is not in FinalizationParams, we might need to fetch it from state if needed,
    // or pass it through. For now, we'll use an empty string as a placeholder if not provided elsewhere.
    await finalizeFacebookReel(pageId, params.creationId, "", pageAccessToken);
    
    return { 
      id: params.creationId, 
      permalink: `https://www.facebook.com/reels/${params.creationId}/` 
    };
  }
}
