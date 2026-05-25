import { z } from '@/lib/api/zod-openapi';

export const UploadInitSchema = z.object({
  title: z.string().optional().default("Untitled Post").openapi({ example: 'My Awesome Post' }),
  description: z.string().optional().openapi({ example: 'A post about technology' }),
  videoFormat: z.string().optional().default("short").openapi({ example: 'short' }),
  platforms: z.array(z.object({
    platform: z.string().openapi({ example: 'youtube' }),
    accountId: z.string().openapi({ example: 'acc_123' }),
    customContent: z.unknown().optional()
  })).min(1, "At least one platform is required")
}).openapi('UploadInit');
