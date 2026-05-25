import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { ByosConfigSchema } from '@/lib/schemas/settings';

export function registerByosGetSettings(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'get',
    path: '/settings/byos',
    description: 'Fetch the user\'s Bring-Your-Own-Storage configuration',
    summary: 'Get BYOS Config',
    tags: ['Settings'],
    responses: {
      200: {
        description: 'Successfully fetched BYOS config',
        content: {
          'application/json': {
            schema: z.object({
              config: ByosConfigSchema.nullable(),
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
