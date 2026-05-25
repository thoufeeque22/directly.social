import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';

export function registerCleanupRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/upload/cleanup',
    description: 'Deletes a staged file from the temporary storage',
    summary: 'Cleanup Upload',
    tags: ['Upload'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              stagedFileId: z.string().openapi({ description: 'The ID of the file to cleanup' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Cleanup successful',
      },
    },
  });
}
