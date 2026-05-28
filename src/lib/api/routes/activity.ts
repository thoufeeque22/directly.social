import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { ActivityQuerySchema, PostActivitySchema } from '@/lib/schemas/activity';

export function registerActivityRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'get',
    path: '/activity',
    description: 'Fetch post activity with pagination and filters',
    summary: 'Get Activity',
    tags: ['Activity'],
    request: {
      query: ActivityQuerySchema,
    },
    responses: {
      200: {
        description: 'List of post activity records',
        content: {
          'application/json': {
            schema: z.object({
              data: z.array(PostActivitySchema),
              nextCursor: z.string().nullable(),
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });
}
