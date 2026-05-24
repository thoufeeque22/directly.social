import { z } from "zod";

export const PlatformResultSchema = z.object({
  platform: z.string(),
  accountId: z.string().optional(),
  accountName: z.string().nullable().optional(),
  platformPostId: z.string().nullable().optional(),
  permalink: z.string().nullable().optional(),
  status: z.enum(['success', 'failed', 'retrying', 'pending', 'cancelled']),
  errorMessage: z.string().nullable().optional(),
  resumableUrl: z.string().nullable().optional(),
  videoId: z.string().nullable().optional(),
  creationId: z.string().nullable().optional(),
  metadata: z.any().optional(),
});

export type PlatformResultInput = z.infer<typeof PlatformResultSchema>;

export const SavePostHistorySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  videoFormat: z.enum(['short', 'long']),
  platforms: z.array(PlatformResultSchema),
  stagedFileId: z.string().optional(),
  scheduledAt: z.union([z.date(), z.string(), z.number()]).transform(val => val ? new Date(val) : null).nullable().optional(),
  isPublished: z.boolean().optional(),
});

export type SavePostHistoryInput = z.infer<typeof SavePostHistorySchema>;
