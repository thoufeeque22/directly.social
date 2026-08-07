import { LinkedInTokenRevokedError } from "./types";

export async function registerLinkedInUpload(accessToken: string, personUrn: string) {
  const registerRes = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ["urn:li:digitalmediaRecipe:feedshare-video"],
        owner: personUrn,
        serviceRelationships: [{
          relationshipType: "OWNER",
          identifier: "urn:li:userGeneratedContent"
        }]
      }
    })
  });

  if (registerRes.status === 401) throw new LinkedInTokenRevokedError();
  if (!registerRes.ok) throw new Error(`LinkedIn register upload failed: ${await registerRes.text()}`);
  
  const registerData = await registerRes.json();
  const uploadUrl = registerData.value?.uploadMechanism?.["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]?.uploadUrl as string | undefined;
  const assetUrn = registerData.value?.asset as string | undefined;

  if (!uploadUrl || !uploadUrl.startsWith("https://")) {
    throw new Error("Invalid or missing upload URL from LinkedIn");
  }
  if (!assetUrn) {
    throw new Error("Missing asset URN from LinkedIn");
  }

  return { uploadUrl, assetUrn };
}

export async function publishLinkedInUgcPost(accessToken: string, personUrn: string, assetUrn: string, description: string, title?: string) {
  const postBody = {
    author: personUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: description },
        shareMediaCategory: 'VIDEO',
        media: [{ media: assetUrn, status: 'READY', title: { text: title || "Video" } }]
      }
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
  };

  const publishRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify(postBody)
  });

  if (!publishRes.ok) throw new Error(`LinkedIn publish failed: ${await publishRes.text()}`);
  const postId = publishRes.headers.get("x-restli-id") ?? "";
  return postId;
}
