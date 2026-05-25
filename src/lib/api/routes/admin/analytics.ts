import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { SystemMetricSchema } from '@/lib/schemas/admin';

export function registerAdminAnalyticsRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'get',
    path: '/admin/analytics',
    description: 'Fetch aggregated system metrics for the last 30 days. Requires ADMIN role.',
    summary: 'Get System Metrics',
    tags: ['Admin'],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully fetched metrics',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              metrics: z.array(SystemMetricSchema),
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized (No session or not an ADMIN)',
      },
    },
  });
}
