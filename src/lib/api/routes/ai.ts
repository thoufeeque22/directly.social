import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { AIKeyValidationSchema } from '@/lib/schemas/ai';

export function registerAiRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/ai/validate-key',
    description: 'Validates an AI provider API key',
    summary: 'Validate AI Key',
    request: {
      body: {
        content: {
          'application/json': {
            schema: AIKeyValidationSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Key is valid',
        content: {
          'application/json': {
            schema: z.object({
              success: z.literal(true),
            }),
          },
        },
      },
      400: {
        description: 'Validation failed',
        content: {
          'application/json': {
            schema: z.object({
              success: z.literal(false),
              error: z.string(),
            }),
          },
        },
      },
    },
  });
}
