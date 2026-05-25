import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerHistoryResourceRoutes } from './resources/history';
import { registerMediaStreamRoutes } from './resources/media-stream';
import { registerMediaDeleteResourceRoutes } from './resources/media-delete';

export function registerResourceRoutes(registry: OpenAPIRegistry) {
  registerHistoryResourceRoutes(registry);
  registerMediaStreamRoutes(registry);
  registerMediaDeleteResourceRoutes(registry);
}
