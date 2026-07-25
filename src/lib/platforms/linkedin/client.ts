import { LinkedInTokenRevokedError } from './types';
import type { LinkedInProfile } from './types';

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';
const USERINFO_URL = 'https://api.linkedin.com/v2/userinfo';
const REFRESH_URL = 'https://www.linkedin.com/oauth/v2/accessToken';

/**
 * (CA-002): LinkedIn API client.
 * Detects 401 responses and surfaces a typed LinkedInTokenRevokedError
 * so the wipe protocol can be triggered by callers.
 */
const linkedInFetch = async (url: string, accessToken: string): Promise<Response> => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 401) {
    throw new LinkedInTokenRevokedError();
  }
  return res;
};

/** Fetches the authenticated member profile (uses OpenID Connect userinfo). */
export const fetchLinkedInProfile = async (accessToken: string): Promise<LinkedInProfile> => {
  const res = await linkedInFetch(USERINFO_URL, accessToken);
  if (!res.ok) throw new Error(`LinkedIn profile fetch failed: ${res.status}`);

  const data = (await res.json()) as {
    sub?: string;
    name?: string;
    email?: string;
    picture?: string;
  };

  return {
    sub: data.sub ?? '',
    name: data.name ?? '',
    email: data.email,
    picture: data.picture,
  };
};

/** Builds the LinkedIn member URN from a profile sub. */
export const buildMemberUrn = (sub: string): string => `urn:li:person:${sub}`;

/** Refreshes a LinkedIn access token using the long-lived refresh token. */
export const refreshLinkedInToken = async (refreshToken: string): Promise<{
  accessToken: string;
  expiresAt: number;
}> => {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.AUTH_LINKEDIN_ID ?? '',
    client_secret: process.env.AUTH_LINKEDIN_SECRET ?? '',
  });

  const res = await fetch(REFRESH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn token refresh failed: ${text}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  const now = Math.floor(Date.now() / 1000);
  return {
    accessToken: data.access_token,
    expiresAt: now + (data.expires_in ?? 5184000),
  };
};

export { LINKEDIN_API_BASE };
