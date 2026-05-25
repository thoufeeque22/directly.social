import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerAdminAnalyticsRoutes } from './admin/analytics';
import { registerAdminAggregateRoutes } from './admin/aggregate';

export function registerAdminRoutes(registry: OpenAPIRegistry) {
  registerAdminAnalyticsRoutes(registry);
  registerAdminAggregateRoutes(registry);
}
