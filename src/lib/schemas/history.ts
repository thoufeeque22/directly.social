import { z } from '@/lib/api/zod-openapi';

export const HistoryQuerySchema = z.object({
  cursor: z.string().optional().openapi({ description: 'Pagination cursor' }),
  limit: z.coerce.number().min(1).max(200).default(20).openapi({ description: 'Number of items to return' }),
  published: z.enum(['true', 'false', 'all']).optional().openapi({ description: 'Filter by published status' }),
  search: z.string().optional().openapi({ description: 'Search query' }),
}).openapi('HistoryQuery');

export const PostHistorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  videoFormat: z.string(),
  isPublished: z.boolean(),
  scheduledAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  platforms: z.array(z.object({
    id: z.string(),
    platform: z.string(),
    accountId: z.string(),
    status: z.string(),
    metadata: z.any().nullable(),
  })),
}).openapi('PostHistory');
