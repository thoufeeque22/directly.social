import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { PostHistorySchema } from '@/lib/schemas/history';

export function registerHistoryResourceRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'get',
    path: '/history/{id}',
    description: 'Fetch a single post history record by ID',
    summary: 'Get Single History',
    tags: ['History'],
    request: {
      params: z.object({
        id: z.string().openapi({ description: 'The ID of the post history record' }),
      }),
    },
    responses: {
      200: {
        description: 'Post history record found',
        content: {
          'application/json': {
            schema: z.object({
              data: PostHistorySchema,
            }),
          },
        },
      },
      404: {
        description: 'Post not found',
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });
}

import { z } from '@/lib/api/zod-openapi';
