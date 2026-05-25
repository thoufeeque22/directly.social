import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { UploadInitializeSchema, UploadAssembleSchema } from '@/lib/schemas/upload-pipeline';

export function registerUploadPipelineRoutes(registry: OpenAPIRegistry) {
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

  registry.registerPath({
    method: 'post',
    path: '/upload/assemble',
    description: 'Concatenates all uploaded chunks into the final video file and registers it in the gallery.',
    summary: 'Assemble Upload',
    tags: ['Upload'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: UploadAssembleSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Upload assembled successfully',
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
    },
  });
}
