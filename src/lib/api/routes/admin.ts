import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { SystemMetricSchema, AggregateResultSchema } from '@/lib/schemas/admin';

export function registerAdminRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'get',
    path: '/admin/analytics',
    description: 'Fetch aggregated system metrics for the last 30 days. Requires ADMIN role.',
    summary: 'Get System Metrics',
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

  registry.registerPath({
    method: 'post',
    path: '/admin/aggregate',
    description: 'Trigger aggregation of Redis telemetry counters into the database. Requires ADMIN role.',
    summary: 'Aggregate Telemetry',
    tags: ['Admin'],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully processed aggregation',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              processed: z.number(),
              details: z.array(AggregateResultSchema),
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
