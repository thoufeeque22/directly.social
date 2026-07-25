import axios from "axios";
import { 
  ILinkedInApiClient, 
  LinkedInProfile, 
  LinkedInPostResponse, 
  LinkedInTokenRefreshResponse 
} from "@/lib/core/ports/linkedin-api-client";

export class TokenRevokedError extends Error {
  constructor(message: string = "LinkedIn authentication revoked.") {
    super(message);
    this.name = "TokenRevokedError";
  }
}

function handleAxiosError(error: unknown): never {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 401) {
      throw new TokenRevokedError();
    }
  }
  throw error;
}

export class LinkedInApiClient implements ILinkedInApiClient {
  constructor(
    private clientId: string = process.env.AUTH_LINKEDIN_ID || "",
    private clientSecret: string = process.env.AUTH_LINKEDIN_SECRET || ""
  ) {}

  async getProfile(accessToken: string): Promise<LinkedInProfile> {
    try {
      const response = await axios.get("https://api.linkedin.com/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async createPost(accessToken: string, personUrn: string, text: string): Promise<LinkedInPostResponse> {
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

  async refreshToken(refreshToken: string): Promise<LinkedInTokenRefreshResponse> {
    try {
      const response = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", 
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret
        }).toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
}
