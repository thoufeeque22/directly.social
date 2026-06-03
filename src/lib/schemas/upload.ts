import { z } from '@/lib/api/zod-openapi';

export const UploadInitSchema = z.object({
  title: z.string().nullable().optional().default("Untitled Post").openapi({ example: 'My Awesome Post' }),
  description: z.string().nullable().optional().openapi({ example: 'A post about technology' }),
  videoFormat: z.string().optional().default("short").openapi({ example: 'short' }),
  platforms: z.array(z.object({
    platform: z.string().openapi({ example: 'youtube' }),
    accountId: z.string().openapi({ example: 'acc_123' }),
    metadata: z.unknown().optional()
  })).min(1, "At least one platform is required")
}).openapi('UploadInit');
