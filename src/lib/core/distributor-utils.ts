/**
 * DISTRIBUTOR UTILITIES
 * Centralized helpers for platform distribution shared between 
 * API routes, Client-side uploads, and the Background Worker.
 */

export interface PlatformData {
  id?: string;
  videoId?: string;
  publish_id?: string;
  permalink?: string;
  data?: {
    id?: string;
  };
}

/**
 * Extracts a platform-native post ID from the API response.
 */
export function extractPlatformPostId(platform: string, data: PlatformData): string | null {
  if (!data) return null;
  switch (platform) {
    case 'youtube': return data.id || data.data?.id || null;
    case 'facebook': return data.videoId || data.id || null;
    case 'instagram': return data.id || data.videoId || null;
    case 'tiktok': return data.publish_id || data.id || null;
    default: return null;
  }
}

import { generateSignedMediaUrl } from "./media-auth";

/**
 * Constructs a public video URL for platforms that require pull-based ingestion (FB/IG).
 * Uses time-limited signed tokens to prevent unauthorized access.
 */
export function constructPublicVideoUrl(stagedFileId: string): string {
  // Use the signed URL utility (defaults to 1 hour expiry)
  return generateSignedMediaUrl(stagedFileId, 60);
}
