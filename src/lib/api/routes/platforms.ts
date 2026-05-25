import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';

export function registerPlatformRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'get',
    path: '/platforms',
    description: 'Fetch the list of supported social media platforms',
    summary: 'List Platforms',
    tags: ['Settings'],
    responses: {
      200: {
        description: 'Successfully fetched platforms',
        content: {
          'application/json': {
            schema: z.array(z.object({
              id: z.string(),
              name: z.string(),
              icon: z.string(),
              authType: z.enum(['oauth2', 'key', 'none']),
            })),
          },
        },
      },
    },
  });
}
