import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { ByosPresignSchema } from '@/lib/schemas/byos-upload';

export function registerByosPresignRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/upload/byos/presign',
    description: 'Initializes or generates part-level presigned URLs for BYOS uploads',
    summary: 'BYOS Presign',
    tags: ['Upload'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: ByosPresignSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Presigned URL or initialization data generated',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              url: z.string().optional(),
              uploadId: z.string().optional(),
              key: z.string().optional(),
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
