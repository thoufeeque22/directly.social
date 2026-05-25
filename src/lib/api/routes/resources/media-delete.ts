import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';

export function registerMediaDeleteResourceRoutes(registry: OpenAPIRegistry) {
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
