import { z } from '@/lib/api/zod-openapi';

export const ByosConfigSchema = z.object({
  bucketName: z.string().optional().openapi({ example: 'my-bucket' }),
  region: z.string().optional().openapi({ example: 'us-east-1' }),
  accessKeyId: z.string().optional().openapi({ example: 'AKIA...' }),
  secretAccessKey: z.string().optional().openapi({ example: 'secret...' }),
  endpoint: z.string().optional().openapi({ example: 'https://...' }),
}).openapi('ByosConfig');
