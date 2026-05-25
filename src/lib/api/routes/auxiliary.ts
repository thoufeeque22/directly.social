import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerCleanupRoutes } from './auxiliary/cleanup';
import { registerStageRoutes } from './auxiliary/stage';
import { registerChunkRoutes } from './auxiliary/chunks';
import { registerTikTokProxyRoutes } from './auxiliary/tiktok';

export function registerAuxiliaryRoutes(registry: OpenAPIRegistry) {
  registerCleanupRoutes(registry);
  registerStageRoutes(registry);
  registerChunkRoutes(registry);
  registerTikTokProxyRoutes(registry);
}
