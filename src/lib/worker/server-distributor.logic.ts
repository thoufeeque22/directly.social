import { logger } from '@/lib/core/logger';
import { getOptimizedVideoPath } from '@/lib/video/transcode-manager';

export function preparePlatformMetadata(
  platform: string, 
  baseTitle: string, 
  baseDesc: string, 
  existingMetadata: unknown, 
  reviewedContent?: Record<string, { title: string; description: string; hashtags?: string[] }>
) {
  let finalTitle = baseTitle;
  let finalDesc = baseDesc;

  const metadata = existingMetadata as { title?: string; description?: string; hashtags?: string[] } | null;
  const platformMetadata = metadata || reviewedContent?.[platform];

  if (platformMetadata) {
    finalTitle = platformMetadata.title || baseTitle;
    const hashText = platformMetadata.hashtags && platformMetadata.hashtags.length > 0 ? `\n\n${platformMetadata.hashtags.join(' ')}` : '';
    finalDesc = (platformMetadata.description || baseDesc) + hashText;
  }

  return { finalTitle, finalDesc };
}

export async function resolveVideoPath(stagedFileId: string, platform: string, activityId: string, accountId: string, defaultPath: string) {
  try {
    return await getOptimizedVideoPath(stagedFileId, platform, activityId, accountId);
  } catch (optErr: unknown) {
    logger.warn(`⚠️ [SERVER-DISTRIBUTOR] Optimization failed for ${platform}, using original. Reason: ${optErr instanceof Error ? optErr.message : String(optErr)}`);
    return defaultPath;
  }
}