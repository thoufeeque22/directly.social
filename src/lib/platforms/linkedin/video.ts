import { prisma } from "@/lib/core/prisma";
import fs from "node:fs";
import { Readable } from "node:stream";
import { initializeVideoUpload, finalizeVideoUpload, finalizeAndPublishPost } from "./video-api";
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
  
  if (!accountId) throw new Error("LinkedIn requires an account selection.");

  const account = await prisma.account.findFirst({
    where: { id: accountId, userId }
  });
  if (!account || !account.access_token || !account.providerAccountId) {
    throw new LinkedInTokenRevokedError("LinkedIn account not found or access token missing");
  }
  
  const accessToken = decryptLinkedInToken(account.access_token);
  const personUrn = `urn:li:person:${account.providerAccountId}`;

  // 0. Compute file size
  let fileSizeBytes = 0;
  if (filePath.startsWith('http')) {
    const headRes = await fetch(filePath, { method: 'HEAD' });
    fileSizeBytes = parseInt(headRes.headers.get('content-length') || '0', 10);
    if (!fileSizeBytes) throw new Error("Could not determine file size from remote URL");
  } else {
    fileSizeBytes = fs.statSync(filePath).size;
  }

  // 1. Initialize Upload
  const { uploadUrl, assetUrn, uploadToken } = await initializeVideoUpload(accessToken, personUrn, fileSizeBytes);
  if (onProgress) onProgress(10);

  // 2. Upload Binary Video Data
  let bodyStream: BodyInit;
  if (filePath.startsWith("http")) {
    const mediaRes = await fetch(filePath);
    if (!mediaRes.ok || !mediaRes.body) throw new Error("Failed to fetch remote media file for upload");
    bodyStream = mediaRes.body;
  } else {
    // Correctly transform fs.ReadStream to a Web ReadableStream
    const nodeStream = fs.createReadStream(filePath);
    bodyStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
  }

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream"
    },
    body: bodyStream,
    duplex: "half"
  } as RequestInit);

  if (!uploadRes.ok) throw new Error(`LinkedIn binary upload failed: ${await uploadRes.text()}`);
  
  // LinkedIn requires the ETag of the uploaded chunk to finalize
  const etag = uploadRes.headers.get("etag");
  if (!etag) {
    throw new Error("LinkedIn binary upload did not return an ETag header");
  }
  
  if (onProgress) onProgress(80);

  // 3. Finalize Upload
  await finalizeVideoUpload(accessToken, assetUrn, uploadToken, [etag]);
  if (onProgress) onProgress(90);

  // 4. Publish Post
  const postId = await finalizeAndPublishPost(accessToken, personUrn, assetUrn, description, title);
  if (onProgress) onProgress(100);

  return {
    postId,
    id: postId,
    creationId: assetUrn
  };
}
