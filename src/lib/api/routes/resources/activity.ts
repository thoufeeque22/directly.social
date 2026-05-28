import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { PostActivitySchema } from '@/lib/schemas/activity';

export function registerActivityResourceRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'get',
    path: '/activity/{id}',
    description: 'Fetch a single post activity record by ID',
    summary: 'Get Single Activity',
    tags: ['Activity'],
    request: {
      params: z.object({
        id: z.string().openapi({ description: 'The ID of the post activity record' }),
      }),
    },
    responses: {
      200: {
        description: 'Post activity record found',
        content: {
          'application/json': {
            schema: z.object({
              data: PostActivitySchema,
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
