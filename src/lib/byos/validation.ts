import { z } from 'zod';

export const byosConfigSchema = z.object({
  provider: z.enum(['S3', 'R2']),
  bucketName: z.string().min(1),
  endpoint: z.string().optional(),
  region: z.string().min(1),
  accessKeyId: z.string().min(1),
  secretAccessKey: z.string().min(1),
  pathPrefix: z.string().optional(),
  keepFiles: z.boolean().default(true),
});

export type ByosConfig = z.infer<typeof byosConfigSchema>;
