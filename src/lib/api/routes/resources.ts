import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerActivityResourceRoutes } from './resources/activity';
import { registerMediaStreamRoutes } from './resources/media-stream';
import { registerMediaDeleteResourceRoutes } from './resources/media-delete';

export function registerResourceRoutes(registry: OpenAPIRegistry) {
  registerActivityResourceRoutes(registry);
  registerMediaStreamRoutes(registry);
  registerMediaDeleteResourceRoutes(registry);
}
