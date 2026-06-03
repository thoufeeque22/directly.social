import { tool } from 'ai';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/core/logger';
import { listUpcomingPostsTool, getMediaGalleryTool, scheduleVideoTool, updatePostTool, cancelPostTool } from '@/lib/actions/ai-chat';

/**
 * (CA-002): Extracted tool definitions for the AI Chat assistant.
 * Improves modularity and reduces the line count of the main route handler.
 */
export const chatTools = {
  list_upcoming_posts: tool({
    description: "Retrieve the user's scheduled posts.",
    inputSchema: z.object({}),
    execute: async () => {
      logger.info('Tool: list_upcoming_posts');
      try {
        const res = await listUpcomingPostsTool();
        logger.info('Tool result: list_upcoming_posts', { count: res?.length });
        return (!res || res.length === 0) ? 'No upcoming posts found.' : res;
      } catch (error: unknown) {
        Sentry.captureException(error);
        return { error: 'Failed to list upcoming posts.' };
      }
    },
  }),
  get_media_gallery: tool({
    description: 'List videos available in the staged gallery for scheduling.',
    inputSchema: z.object({}),
    execute: async () => {
      logger.info('Tool: get_media_gallery');
      try {
        const res = await getMediaGalleryTool();
        logger.info('Tool result: get_media_gallery', { count: res?.length });
        return res ?? { success: true, assets: [] };
      } catch (error: unknown) {
        Sentry.captureException(error);
        return { error: 'Failed to fetch media gallery.' };
      }
    },
  }),
  schedule_video: tool({
    description: 'Schedule a video from the gallery to social platforms.',
    inputSchema: z.object({
      fileId: z.string().describe('The ID of the file from the media gallery.'),
      title: z.string().describe('The title for the post.'),
      description: z.string().optional().describe('The description for the post.'),
      scheduledAt: z.string().describe('ISO date string for when to schedule the post.'),
      platforms: z.array(z.string()).describe('List of platforms to schedule to (e.g., youtube, tiktok, instagram).'),
    }),
    execute: async (params) => {
      logger.info('Tool: schedule_video', params);
      try {
        const res = await scheduleVideoTool(params);
        logger.info('Tool result: schedule_video', { success: !!res });
        return res ?? { success: true };
      } catch (error: unknown) {
        Sentry.captureException(error);
        return { error: 'Failed to schedule video.' };
      }
    },
  }),
  update_post: tool({
    description: 'Update details of an existing scheduled post.',
    inputSchema: z.object({
      id: z.string().describe('The ID of the scheduled post.'),
      data: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        scheduledAt: z.string().optional(),
      }),
    }),
    execute: async ({ id, data }) => {
      try {
        const res = await updatePostTool(id, data);
        return res ?? { success: true };
      } catch (error: unknown) {
        Sentry.captureException(error);
        return { error: 'Failed to update post.' };
      }
    },
  }),
  cancel_post: tool({
    description: 'Delete a scheduled post.',
    inputSchema: z.object({
      id: z.string().describe('The ID of the scheduled post to cancel.'),
    }),
    execute: async ({ id }) => {
      try {
        const res = await cancelPostTool(id);
        return res ?? { success: true };
      } catch (error: unknown) {
        Sentry.captureException(error);
        return { error: 'Failed to cancel post.' };
      }
    },
  }),
};
