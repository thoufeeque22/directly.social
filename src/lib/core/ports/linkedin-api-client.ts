export interface LinkedInProfile {
  id: string;
  localizedFirstName?: string;
  localizedLastName?: string;
}

export interface LinkedInPostResponse {
  id: string;
}

export interface LinkedInTokenRefreshResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface ILinkedInApiClient {
  getProfile(accessToken: string): Promise<LinkedInProfile>;
  createPost(accessToken: string, personUrn: string, text: string): Promise<LinkedInPostResponse>;
  refreshToken(refreshToken: string): Promise<LinkedInTokenRefreshResponse>;
}
