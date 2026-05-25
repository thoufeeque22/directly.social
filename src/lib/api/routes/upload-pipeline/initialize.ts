import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { UploadInitializeSchema } from '@/lib/schemas/upload-pipeline';

export function registerPipelineInitialize(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/upload/initialize',
    description: 'Initializes a new multi-part upload and checks storage quota',
    summary: 'Initialize Upload Pipeline',
    tags: ['Upload'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: UploadInitializeSchema,
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
      403: {
        description: 'Storage limit exceeded',
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });
}

import { z } from '@/lib/api/zod-openapi';
