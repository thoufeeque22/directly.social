import { getInstagramAccount } from "./account";
import { createInstagramContainer } from "./container";
import { pushBinaryToMeta, fetchMetaUploadOffset } from "@/lib/core/platforms/meta-uploader";
import { pollMetaStatus } from "@/lib/core/platforms/meta-utils";
import { finalizeInstagramPublish, fetchInstagramPermalink } from "./finalize";

/**
 * (CA-003): Encapsulates Instagram API calls and platform-specific logic.
 */
export class InstagramClient {
  async getAccount(userId: string, accountId: string) {
    return getInstagramAccount(userId, accountId);
  }

  async createContainer(igUserId: string, accessToken: string, description: string) {
    return createInstagramContainer(igUserId, accessToken, description);
  }

  async fetchUploadOffset(creationId: string, accessToken: string) {
    const uploadUrl = `https://rupload.facebook.com/ig-api-upload/v20.0/${creationId}`;
    return fetchMetaUploadOffset(uploadUrl, accessToken);
  }

  async pushBinary(creationId: string, filePath: string, accessToken: string, offset: number, onProgress?: (pct: number) => void) {
    const uploadUrl = `https://rupload.facebook.com/ig-api-upload/v20.0/${creationId}`;
    return pushBinaryToMeta({
      filePath,
      uploadUrl,
      accessToken,
      startOffset: offset,
      onProgress
    });
  }

  async pollStatus(creationId: string, accessToken: string) {
    const statusUrl = `https://graph.facebook.com/v20.0/${creationId}?fields=status_code&access_token=${accessToken}`;
    return pollMetaStatus(statusUrl);
  }

  async finalize(igUserId: string, creationId: string, accessToken: string) {
    return finalizeInstagramPublish(igUserId, creationId, accessToken);
  }

  async getPermalink(mediaId: string, accessToken: string) {
    return fetchInstagramPermalink(mediaId, accessToken);
  }
}
