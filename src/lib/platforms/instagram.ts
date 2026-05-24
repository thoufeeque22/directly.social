import { getInstagramAccount } from "./instagram/account";
import { createInstagramContainer } from "./instagram/container";
import { pushBinaryToMeta } from "@/lib/core/platforms/meta-uploader";
import { pollMetaStatus } from "@/lib/core/platforms/meta-utils";
import { finalizeInstagramPublish, fetchInstagramPermalink } from "./instagram/finalize";
import { fetchInstagramStats } from "./instagram/stats";
import { MetaPublishParams } from "@/lib/core/platforms/types";

export { getInstagramAccount };

export const publishInstagramReel = async ({
  userId, filePath, description, caption, musicId, accountId, creationId: existingCreationId, onProgress,
}: MetaPublishParams) => {
  const { igUserId, userAccessToken } = await getInstagramAccount(userId, accountId);
  const finalCaption = caption || description || "";
  const creationId = existingCreationId || await createInstagramContainer(igUserId, userAccessToken, finalCaption, musicId);

  await pushBinaryToMeta({
    filePath,
    uploadUrl: `https://rupload.facebook.com/ig-api-upload/v20.0/${creationId}`,
    accessToken: userAccessToken,
    onProgress,
  });

  const statusUrl = `https://graph.facebook.com/v20.0/${creationId}?fields=status_code&access_token=${userAccessToken}`;
  await pollMetaStatus(statusUrl);

  const publishedMediaId = await finalizeInstagramPublish(igUserId, creationId, userAccessToken);
  const permalink = await fetchInstagramPermalink(publishedMediaId, userAccessToken);

  return { id: publishedMediaId, creationId, permalink: permalink || `https://www.instagram.com/reel/${publishedMediaId}/` };
};

export const getInstagramStats = async (userId: string, accountId?: string) => {
  const { igUserId, userAccessToken } = await getInstagramAccount(userId, accountId);
  return fetchInstagramStats(igUserId, userAccessToken);
};
