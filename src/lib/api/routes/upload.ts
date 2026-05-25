import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { UploadInitSchema } from '@/lib/schemas/upload';

export function registerUploadRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/upload/init',
    description: 'Pre-initializes a post history record',
    summary: 'Initialize Upload',
    request: {
      body: {
        content: {
          'application/json': {
            schema: UploadInitSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Successfully initialized',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              data: z.object({
                historyId: z.string(),
              }),
            }),
          },
        },
      },
    },
  });
}
