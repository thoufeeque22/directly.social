import { getFacebookPageAccount } from "./facebook/account";
import { initFacebookReel, finalizeFacebookReel } from "./facebook/reel";
import { publishFacebookVideoDirect } from "./facebook/video";
import { pushBinaryToMeta, fetchMetaUploadOffset } from "@/lib/core/platforms/meta-uploader";
import { pollMetaStatus } from "@/lib/core/platforms/meta-utils";
import { MetaPublishParams } from "@/lib/core/platforms/types";

export { getFacebookPageAccount };

export const publishFacebookVideo = async ({
  userId, title, description, filePath, accountId,
}: MetaPublishParams) => {
  const { pageId, pageAccessToken, pageName } = await getFacebookPageAccount(userId, accountId);
  const result = await publishFacebookVideoDirect({ 
    pageId, pageAccessToken, title: title || "", description: description || "", filePath 
  });
  return { ...result, pageName };
};

export const publishFacebookReel = async ({
  userId, filePath, description, accountId, videoId: existingVideoId, onProgress,
}: MetaPublishParams) => {
  const { pageId, pageAccessToken, pageName } = await getFacebookPageAccount(userId, accountId);
  const videoId = existingVideoId || await initFacebookReel(pageId, pageAccessToken);
  const uploadUrl = `https://rupload.facebook.com/video-upload/v22.0/${videoId}`;

  const startOffset = existingVideoId ? await fetchMetaUploadOffset(uploadUrl, pageAccessToken) : 0;

  await pushBinaryToMeta({
    filePath,
    uploadUrl,
    accessToken: pageAccessToken,
    onProgress,
    startOffset,
  });

  const statusUrl = `https://graph.facebook.com/v20.0/${videoId}?fields=status&access_token=${pageAccessToken}`;
  await pollMetaStatus(statusUrl);

  await finalizeFacebookReel(pageId, videoId, description || "", pageAccessToken);
  return { success: true, videoId, pageName };
};
