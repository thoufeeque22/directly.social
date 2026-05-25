import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { ByosConfigSchema } from '@/lib/schemas/settings';

export function registerByosSaveSettings(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/settings/byos',
    description: 'Save the user\'s Bring-Your-Own-Storage configuration',
    summary: 'Save BYOS Config',
    tags: ['Settings'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: ByosConfigSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Successfully saved BYOS config',
        content: {
          'application/json': {
            schema: z.object({
              config: ByosConfigSchema,
            }),
          },
        },
      },
      400: {
        description: 'Invalid input',
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });
}
