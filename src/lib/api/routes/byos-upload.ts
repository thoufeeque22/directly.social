import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { ByosPresignSchema, ByosCompleteSchema } from '@/lib/schemas/byos-upload';

export function registerByosUploadRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/upload/byos/presign',
    description: 'Initializes or generates part-level presigned URLs for BYOS uploads',
    summary: 'BYOS Presign',
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

  registry.registerPath({
    method: 'post',
    path: '/upload/byos/complete',
    description: 'Completes a BYOS multi-part upload and registers the asset',
    summary: 'BYOS Complete',
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
                historyId: z.string(),
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
