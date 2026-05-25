import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';

export function registerPipelineChunk(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/upload/chunk',
    description: 'Uploads a single chunk of a video file. Requires x-upload-id and x-chunk-index headers.',
    summary: 'Upload Chunk',
    tags: ['Upload'],
    request: {
      headers: z.object({
        'x-upload-id': z.string().openapi({ description: 'Unique ID for the upload session' }),
        'x-chunk-index': z.string().openapi({ description: 'Zero-based index of the chunk' }),
      }),
      body: {
        content: {
          'application/octet-stream': {
            schema: z.string().openapi({ format: 'binary' }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Chunk uploaded successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              index: z.string(),
            }),
          },
        },
      },
    },
  });
}
