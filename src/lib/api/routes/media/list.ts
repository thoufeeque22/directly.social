import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { GalleryAssetSchema } from '@/lib/schemas/media';

export function registerMediaListRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'get',
    path: '/media',
    description: 'Fetch staged gallery assets for the authenticated user',
    summary: 'List Media Assets',
    tags: ['Media'],
    request: {
      query: z.object({
        search: z.string().optional().openapi({ description: 'Filter assets by filename' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully fetched assets',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              data: z.array(GalleryAssetSchema),
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });
}
