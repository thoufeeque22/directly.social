import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { UploadInitSchema } from '@/lib/schemas/upload';

export function registerUploadRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/upload/init',
    description: 'Pre-initializes a post activity record',
    summary: 'Initialize Upload',
    tags: ['Upload'],
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
                activityId: z.string(),
              }),
            }),
          },
        },
      },
    },
  });
}
