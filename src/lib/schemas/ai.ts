import { z } from '@/lib/api/zod-openapi';

export const AIKeyValidationSchema = z.object({
  provider: z.string().openapi({ example: 'openai' }),
  apiKey: z.string().openapi({ example: 'sk-...' }),
}).openapi('AIKeyValidation');
