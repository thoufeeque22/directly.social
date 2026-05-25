import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { DisconnectSchema } from '@/lib/schemas/auxiliary';

export function registerDisconnectRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/settings/disconnect',
    description: 'Disconnects a social media platform account from the user profile',
    summary: 'Disconnect Platform',
    tags: ['Settings'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: DisconnectSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Successfully disconnected',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
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
