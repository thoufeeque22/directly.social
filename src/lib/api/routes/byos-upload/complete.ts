import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { ByosCompleteSchema } from '@/lib/schemas/byos-upload';

export function registerByosCompleteRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/upload/byos/complete',
    description: 'Completes a BYOS multi-part upload and registers the asset',
    summary: 'BYOS Complete',
    tags: ['Upload'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: ByosCompleteSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Upload completed and registered',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              data: z.object({
                fileId: z.string(),
                fileName: z.string(),
                activityId: z.string(),
              }),
            }),
          },
        },
      },
      400: {
        description: 'Bad request or BYOS not configured',
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });
}
