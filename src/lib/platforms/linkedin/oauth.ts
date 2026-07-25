import { createHmac, randomBytes } from 'crypto';
import type { LinkedInTokenSet } from './types';

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const SCOPES = 'openid profile email w_member_social r_liteprofile';

/**
 * (OO-001): Generates a HMAC-signed OAuth state nonce.
 * Prevents Login Replay Attacks (Security Checklist #7).
 */
export const generateOAuthState = (userId: string): string => {
  const secret = process.env.AUTH_SECRET ?? 'dev-secret';
  const nonce = randomBytes(16).toString('hex');
  const payload = `${userId}:${nonce}`;
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
};

/** Validates the state param and extracts the userId. */
export const verifyOAuthState = (state: string): string => {
  const secret = process.env.AUTH_SECRET ?? 'dev-secret';
  const decoded = Buffer.from(state, 'base64url').toString('utf8');
  const [userId, nonce, sig] = decoded.split(':');
  if (!userId || !nonce || !sig) throw new Error('Invalid OAuth state');
  const expected = createHmac('sha256', secret)
    .update(`${userId}:${nonce}`)
    .digest('hex');
  if (expected !== sig) throw new Error('OAuth state signature mismatch');
  return userId;
};

/** Builds the LinkedIn authorization URL. */
export const buildAuthorizationUrl = (userId: string, redirectUri: string): string => {
  const clientId = process.env.AUTH_LINKEDIN_ID ?? '';
  const state = generateOAuthState(userId);
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: SCOPES,
    state,
  });
  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
};

/** Exchanges an authorization code for a token set. */
export const exchangeCodeForTokens = async (
  code: string,
  redirectUri: string,
): Promise<LinkedInTokenSet> => {
  const clientId = process.env.AUTH_LINKEDIN_ID ?? '';
  const clientSecret = process.env.AUTH_LINKEDIN_SECRET ?? '';
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(LINKEDIN_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn token exchange failed: ${text}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_token_expires_in?: number;
  };

  const now = Math.floor(Date.now() / 1000);
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: now + (data.expires_in ?? 5184000),
    refreshExpiresAt: now + (data.refresh_token_expires_in ?? 31536000),
  };
};
