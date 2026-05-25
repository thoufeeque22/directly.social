import { z } from '@/lib/api/zod-openapi';

export const PlatformUploadSchema = z.object({
  fileId: z.string().openapi({ description: 'The ID of the file to upload' }),
  title: z.string().optional(),
  description: z.string().optional(),
  accountId: z.string().openapi({ description: 'The platform-specific account ID' }),
  fields: z.record(z.any()).optional().openapi({ description: 'Platform-specific fields' }),
}).openapi('PlatformUpload');

export const YouTubeUploadSchema = PlatformUploadSchema.extend({
  fields: z.object({
    privacy: z.enum(['public', 'private', 'unlisted']).optional().default('private'),
    resumableUrl: z.string().optional(),
  }).optional(),
}).openapi('YouTubeUpload');
