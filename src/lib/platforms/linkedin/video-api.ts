import { LinkedInTokenRevokedError } from "./types";

export async function initializeVideoUpload(accessToken: string, personUrn: string, fileSizeBytes: number) {
  const registerRes = await fetch("https://api.linkedin.com/rest/videos?action=initializeUpload", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202607",
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify({
      initializeUploadRequest: {
        owner: personUrn,
        fileSizeBytes,
        uploadCaptions: false,
        uploadThumbnail: false
      }
    })
  });

  if (registerRes.status === 401) throw new LinkedInTokenRevokedError();
  if (!registerRes.ok) throw new Error(`LinkedIn initialize upload failed: ${await registerRes.text()}`);
  
  const registerData = await registerRes.json();
  const uploadUrl = registerData.value?.uploadInstructions?.[0]?.uploadUrl as string | undefined;
  const assetUrn = registerData.value?.video as string | undefined;
  const uploadToken = registerData.value?.uploadToken as string | undefined;

  if (!uploadUrl || !uploadUrl.startsWith("https://")) {
    throw new Error("Invalid or missing upload URL from LinkedIn /rest/videos");
  }
  if (!assetUrn) {
    throw new Error("Missing video URN from LinkedIn /rest/videos");
  }

  return { uploadUrl, assetUrn, uploadToken: uploadToken || "" };
}

export async function finalizeVideoUpload(accessToken: string, assetUrn: string, uploadToken: string, uploadedPartIds: string[] = []) {
  const finalizeRes = await fetch("https://api.linkedin.com/rest/videos?action=finalizeUpload", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202607",
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify({
      finalizeUploadRequest: {
        video: assetUrn,
        uploadedPartIds,
        uploadToken
      }
    })
  });

  if (!finalizeRes.ok) throw new Error(`LinkedIn finalize upload failed: ${await finalizeRes.text()}`);
}

export async function finalizeAndPublishPost(accessToken: string, personUrn: string, assetUrn: string, description: string, title?: string) {
  const postBody = {
    author: personUrn,
    commentary: description,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: []
    },
    content: {
      media: {
        id: assetUrn,
        title: title || "Video"
      }
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false
  };

  const publishRes = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202607",
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify(postBody)
  });

  if (!publishRes.ok) throw new Error(`LinkedIn publish failed: ${await publishRes.text()}`);
  const postId = publishRes.headers.get("x-restli-id") ?? "";
  return postId;
}
