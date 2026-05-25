import { z } from '@/lib/api/zod-openapi';

export const ByosPresignSchema = z.object({
  action: z.enum(['initialize', 'presignPart']),
  fileName: z.string().min(1).openapi({ example: 'video.mp4' }),
  fileSize: z.number().max(500 * 1024 * 1024).optional().openapi({ description: 'Required for initialize' }),
  uploadId: z.string().optional().openapi({ description: 'Required for presignPart' }),
  key: z.string().optional().openapi({ description: 'Required for presignPart' }),
  partNumber: z.number().int().min(1).optional().openapi({ description: 'Required for presignPart' }),
}).openapi('ByosPresign');

export const ByosCompleteSchema = z.object({
  uploadId: z.string().min(1),
  key: z.string().min(1),
  fileName: z.string().min(1),
  fileSize: z.number().min(1),
  mimeType: z.string().optional(),
  parts: z.array(z.object({
    PartNumber: z.number(),
    ETag: z.string()
  })).min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  videoFormat: z.string().optional(),
  historyId: z.string().optional(),
  platforms: z.array(z.object({
    platform: z.string(),
    accountId: z.string()
  })).optional(),
  scheduledAt: z.string().optional(),
}).openapi('ByosComplete');
