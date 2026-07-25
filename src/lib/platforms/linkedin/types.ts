/**
 * (API-001): Strongly-typed interfaces for the LinkedIn integration domain.
 * Scope: Content Scheduling MVP — Member Profile targets only.
 */

export interface LinkedInTokenSet {
  accessToken: string;
  refreshToken: string;
  /** Unix epoch seconds — access token valid for 60 days */
  expiresAt: number;
  /** Unix epoch seconds — refresh token valid for 365 days */
  refreshExpiresAt: number;
}

/** Encrypted representation stored at rest (AES-256-GCM). */
export interface LinkedInEncryptedTokenSet {
  encryptedAccessToken: string;
  encryptedRefreshToken: string;
  expiresAt: number;
  refreshExpiresAt: number;
}

export interface LinkedInProfile {
  sub: string;
  name: string;
  email?: string;
  picture?: string;
}

export interface LinkedInPostPayload {
  authorUrn: string;
  text: string;
}

export interface LinkedInPostResult {
  postId: string;
  permalink: string;
}

export type LinkedInWipeReason = 'token_revoked' | 'user_requested';

/** Structured error to distinguish 401 revocations from other failures. */
export class LinkedInTokenRevokedError extends Error {
  constructor(message = 'LinkedIn token has been revoked') {
    super(message);
    this.name = 'LinkedInTokenRevokedError';
  }
}
