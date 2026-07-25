import axios from "axios";

export class TokenRevokedError extends Error {
  constructor(message: string = "LinkedIn authentication revoked.") {
    super(message);
    this.name = "TokenRevokedError";
  }
}

function handleAxiosError(error: unknown) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 401) {
      throw new TokenRevokedError();
    }
  }
  throw error;
}

export async function verifyLinkedInProfile(accessToken: string) {
  try {
    const response = await axios.get("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function createLinkedInPost(
  accessToken: string,
  personUrn: string,
  text: string
) {
  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: `urn:li:person:${personUrn}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text },
            shareMediaCategory: "NONE",
          }
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function refreshLinkedInToken(refreshToken: string) {
  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.AUTH_LINKEDIN_ID || "",
      client_secret: process.env.AUTH_LINKEDIN_SECRET || ""
    })
  });
  if (!res.ok) {
    throw new Error(`Failed to refresh token: ${res.statusText}`);
  }
  return res.json();
}
