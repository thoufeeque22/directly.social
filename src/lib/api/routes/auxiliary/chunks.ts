import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';

export function registerChunkRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'get',
    path: '/upload/chunks/{uploadId}',
    description: 'Returns a list of already uploaded chunk indices for an active session',
    summary: 'Get Uploaded Chunks',
    tags: ['Upload'],
    request: {
      params: z.object({
        uploadId: z.string().openapi({ description: 'The unique ID for the upload session' }),
      }),
    },
    responses: {
      200: {
        description: 'List of uploaded chunk indices',
        content: {
          'application/json': {
            schema: z.object({
              chunks: z.array(z.number()),
            }),
          },
        },
      },
    },
  });
}
