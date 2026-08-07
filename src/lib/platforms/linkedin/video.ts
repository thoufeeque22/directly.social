import { prisma } from "@/lib/core/prisma";
import fs from "node:fs";
import { Readable } from "node:stream";
import { registerLinkedInUpload, publishLinkedInUgcPost } from "./video-api";
import { LinkedInTokenRevokedError } from "./types";
import { decryptLinkedInToken } from "./encrypt";

interface PublishLinkedInVideoParams {
  userId: string;
  filePath: string;
  description: string;
  accountId?: string;
  title?: string;
  onProgress?: (percent: number) => void;
}

export async function publishLinkedInVideo({
  userId,
  filePath,
  description,
  accountId,
  title,
  onProgress
}: PublishLinkedInVideoParams) {
  if (!accountId) throw new Error("LinkedIn account ID is required");
  
  // FIX: Enforce IDOR protection by matching userId
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId }
  });
  if (!account || !account.access_token || !account.providerAccountId) {
    throw new LinkedInTokenRevokedError("LinkedIn account not found or access token missing");
  }
  
  const accessToken = decryptLinkedInToken(account.access_token);
  const personUrn = `urn:li:person:${account.providerAccountId}`;

  // 1. Register Upload
  const { uploadUrl, assetUrn } = await registerLinkedInUpload(accessToken, personUrn);
  if (onProgress) onProgress(10);

  // 2. Upload Binary
  // FIX: Convert Node stream to Web Stream to prevent undici TypeError (500 Error)
  const fileStream = fs.createReadStream(filePath);
  const webStream = Readable.toWeb(fileStream);
  
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/octet-stream",
    },
    body: webStream as any,
    duplex: "half"
  } as any);

  if (!uploadRes.ok) throw new Error(`LinkedIn binary upload failed: ${await uploadRes.text()}`);
  if (onProgress) onProgress(90);

  // 3. Publish Post using ugcPosts
  const postId = await publishLinkedInUgcPost(accessToken, personUrn, assetUrn, description, title);
  if (onProgress) onProgress(100);

  const activityUrn = postId.replace('ugcPost', 'activity').replace('share', 'activity');

  return {
    postId,
    id: postId,
    creationId: assetUrn,
    permalink: `https://www.linkedin.com/feed/update/${activityUrn}/`
  };
}
