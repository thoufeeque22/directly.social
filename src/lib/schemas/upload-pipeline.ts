import { z } from '@/lib/api/zod-openapi';

export const UploadInitializeSchema = z.object({
  title: z.string().optional().default("Untitled Post").openapi({ example: 'My Video Title' }),
  description: z.string().optional().openapi({ example: 'A description of my video' }),
  videoFormat: z.string().optional().default("short").openapi({ example: 'short' }),
  platforms: z.array(z.object({
    platform: z.string().openapi({ example: 'youtube' }),
    accountId: z.string().openapi({ example: 'acc_123' }),
  })).openapi({ description: 'Target platforms for the upload' }),
  scheduledAt: z.string().optional().openapi({ description: 'ISO date string for scheduling', example: '2026-05-26T10:00:00Z' }),
  isPublished: z.boolean().optional().default(true).openapi({ description: 'Whether to publish immediately' }),
}).openapi('UploadInitialize');

export const UploadAssembleSchema = z.object({
  blobUrl: z.string().url().openapi({ example: 'https://pub-xxx.r2.dev/video.mp4' }),
  fileName: z.string().openapi({ example: 'video.mp4' }),
  totalSize: z.number().optional().openapi({ example: 10485760 }),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  videoFormat: z.string().optional(),
  activityId: z.string().nullable().optional(),
  platforms: z.array(z.object({
    platform: z.string(),
    accountId: z.string(),
    metadata: z.unknown().optional()
  })).optional(),
  scheduledAt: z.string().optional().openapi({ example: '2026-05-26T10:00:00Z' }),
}).openapi('UploadAssemble');
