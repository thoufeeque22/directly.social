import path from 'path';
import { logger } from '@/lib/core/logger';
import { inngest } from '@/lib/inngest/client';
import { fetchExistingResult, upsertPlatformResult, recordPlatformFailure } from './server-distributor.db';
import { preparePlatformMetadata } from './server-distributor.logic';

export interface DistributionResult {
  platform: string; accountId: string; accountName?: string | null; platformPostId?: string | null; permalink?: string | null;
  status: 'success' | 'failed' | 'cancelled' | 'pending' | 'uploading' | 'processing' | 'retrying';
  errorMessage?: string; resumableUrl?: string | null; videoId?: string | null; creationId?: string | null;
}

export interface ServerDistributeParams {
  stagedFileId: string; userId: string; activityId: string; title: string; description: string; videoFormat: 'short' | 'long';
  platforms: { platform: string; accountId: string; accountName: string | null; }[];
  reviewedContent?: Record<string, { title: string; description: string; hashtags?: string[] }>;
}

/**
 * (CA-002): Triggers Inngest workflows for durable server-side distribution.
 * Replaces direct execution with event-driven orchestration.
 */
export async function distributeToPlatformsServer(params: ServerDistributeParams) {
  const { stagedFileId, userId, activityId, title, description, videoFormat, platforms } = params;
  logger.info(`👷 [SERVER-DISTRIBUTOR] Triggering durable workflows for post ${activityId}`);

  const events = await Promise.all(platforms.map(async (p) => {
    const existing = await fetchExistingResult(activityId, p.platform, p.accountId);
    const { finalTitle, finalDesc } = preparePlatformMetadata(p.platform, title, description, existing?.metadata, params.reviewedContent);
    
    return {
      name: "video.publish" as const,
      data: {
        activityId,
        platform: p.platform,
        accountId: p.accountId,
        userId,
        stagedFileId,
        title: finalTitle,
        description: finalDesc,
        videoFormat,
        reviewedContent: params.reviewedContent
      }
    };
  }));

  await inngest.send(events);

  return platforms.map(p => ({
    platform: p.platform,
    accountId: p.accountId,
    accountName: p.accountName,
    status: 'pending' as const
  }));
}