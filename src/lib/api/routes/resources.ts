import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { PostHistorySchema } from '@/lib/schemas/history';

export function registerResourceRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'get',
    path: '/history/{id}',
    description: 'Fetch a single post history record by ID',
    summary: 'Get Single History',
    tags: ['History'],
    request: {
      params: z.object({
        id: z.string().openapi({ description: 'The ID of the post history record' }),
      }),
    },
    responses: {
      200: {
        description: 'Post history record found',
        content: {
          'application/json': {
            schema: z.object({
              data: PostHistorySchema,
            }),
          },
        },
      },
      404: {
        description: 'Post not found',
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/media/{fileId}',
    description: 'Fetch and stream a media asset. Requires signed token.',
    summary: 'Stream Media',
    tags: ['Media'],
    request: {
      params: z.object({
        fileId: z.string().openapi({ description: 'The unique ID of the media file' }),
      }),
      query: z.object({
        expires: z.string().openapi({ description: 'Token expiration timestamp' }),
        signature: z.string().openapi({ description: 'HMAC signature for authentication' }),
      }),
    },
    responses: {
      200: {
        description: 'Media stream',
        content: {
          'video/mp4': {
            schema: z.string().openapi({ format: 'binary' }),
          },
        },
      },
      206: {
        description: 'Partial media content',
      },
      403: {
        description: 'Forbidden: Invalid or expired token',
      },
      404: {
        description: 'File not found',
      },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/media/{fileId}',
    description: 'Securely delete a media asset from the gallery and disk',
    summary: 'Delete Single Media',
    tags: ['Media'],
    request: {
      params: z.object({
        fileId: z.string().openapi({ description: 'The ID of the file to delete' }),
      }),
    },
    responses: {
      200: {
        description: 'Asset deleted successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              dbDeleted: z.boolean(),
              diskDeleted: z.boolean(),
            }),
          },
        },
      },
      404: {
        description: 'Asset not found',
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });
}
