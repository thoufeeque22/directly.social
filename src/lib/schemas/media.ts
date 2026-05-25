import { z } from '@/lib/api/zod-openapi';

export const GalleryAssetSchema = z.object({
  id: z.string(),
  fileId: z.string(),
  fileName: z.string(),
  fileSize: z.number().nullable(),
  mimeType: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  expiresAt: z.string(),
  previewUrl: z.string().openapi({ description: 'Signed URL for previewing the asset' }),
}).openapi('GalleryAsset');

export const MediaDeleteSchema = z.object({
  fileIds: z.array(z.string()).optional().openapi({ description: 'List of file IDs to delete' }),
  deleteAll: z.boolean().optional().openapi({ description: 'Whether to delete all assets for the user' }),
}).openapi('MediaDelete');
