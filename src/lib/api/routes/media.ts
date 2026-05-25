import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerMediaListRoutes } from './media/list';
import { registerMediaBulkDeleteRoutes } from './media/bulk-delete';

export function registerMediaRoutes(registry: OpenAPIRegistry) {
  registerMediaListRoutes(registry);
  registerMediaBulkDeleteRoutes(registry);
}
