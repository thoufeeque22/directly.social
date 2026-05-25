import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { GalleryAssetSchema, MediaDeleteSchema } from '@/lib/schemas/media';

export function registerMediaRoutes(registry: OpenAPIRegistry) {
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

  registry.registerPath({
    method: 'delete',
    path: '/media',
    description: 'Bulk delete staged gallery assets',
    summary: 'Bulk Delete Media',
    tags: ['Media'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: MediaDeleteSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Successfully deleted assets',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              dbCount: z.number(),
              diskCount: z.number(),
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
      400: {
        description: 'Validation failed or no IDs provided',
      },
    },
  });
}
