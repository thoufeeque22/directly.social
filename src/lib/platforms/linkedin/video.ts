import { prisma } from "@/lib/core/prisma";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
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

function validateUrl(urlPath: string) {
  const url = new URL(urlPath);
  if (url.protocol !== "https:") throw new Error("Only HTTPS URLs are allowed");
  if (
    url.hostname === "localhost" || 
    url.hostname === "127.0.0.1" || 
    url.hostname === "169.254.169.254" || 
    url.hostname.startsWith("10.") || 
    url.hostname.startsWith("192.168.")
  ) {
    throw new Error("Internal or metadata URLs are strictly prohibited");
  }
}

function validateLocalPath(localPath: string) {
  const resolved = path.resolve(localPath);
  const tmpDir = path.resolve(os.tmpdir());
  if (!resolved.startsWith(tmpDir)) {
    throw new Error("Local File Inclusion attempt detected. File path must be within the system temporary directory.");
  }
  return resolved;
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

  // 0. Compute file size with strict validation
  let fileSizeBytes = 0;
  if (filePath.startsWith('http')) {
    validateUrl(filePath);
    const headRes = await fetch(filePath, { method: 'HEAD', signal: AbortSignal.timeout(10000) });
    fileSizeBytes = parseInt(headRes.headers.get('content-length') || '0', 10);
    if (!fileSizeBytes || fileSizeBytes > 1024 * 1024 * 500) {
      throw new Error("Invalid file size or exceeds 500MB limit for LinkedIn video");
    }
  } else {
    filePath = validateLocalPath(filePath);
    fileSizeBytes = fs.statSync(filePath).size;
  }

  // 1. Initialize Upload
  const { uploadUrl, assetUrn, uploadToken } = await initializeVideoUpload(accessToken, personUrn, fileSizeBytes);
  if (onProgress) onProgress(10);

  // 2. Upload Binary Video Data
  let bodyStream: BodyInit;
  if (filePath.startsWith("http")) {
    const mediaRes = await fetch(filePath, { signal: AbortSignal.timeout(300000) });
    if (!mediaRes.ok || !mediaRes.body) throw new Error("Failed to fetch remote media file for upload");
    bodyStream = mediaRes.body;
  } else {
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
