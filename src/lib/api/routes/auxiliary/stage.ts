import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';

export function registerStageRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/upload/stage',
    description: 'Uploads a large video file in a single stream and stages it on disk',
    summary: 'Stage Upload',
    tags: ['Upload'],
    request: {
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              file: z.string().openapi({ format: 'binary' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'File staged successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              data: z.object({
                fileId: z.string(),
                fileName: z.string(),
              }),
            }),
          },
        },
      },
    },
  });
}
