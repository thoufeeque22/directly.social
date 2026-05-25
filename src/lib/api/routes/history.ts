import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { HistoryQuerySchema, PostHistorySchema } from '@/lib/schemas/history';

export function registerHistoryRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'get',
    path: '/history',
    description: 'Fetch post history with pagination and filters',
    summary: 'Get History',
    request: {
      query: HistoryQuerySchema,
    },
    responses: {
      200: {
        description: 'List of post history records',
        content: {
          'application/json': {
            schema: z.object({
              data: z.array(PostHistorySchema),
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
