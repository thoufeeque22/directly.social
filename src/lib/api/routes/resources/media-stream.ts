import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';

export function registerMediaStreamRoutes(registry: OpenAPIRegistry) {
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
}
