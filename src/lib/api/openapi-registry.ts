import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { registerAiRoutes } from './routes/ai';
import { registerUploadRoutes } from './routes/upload';
import { registerChatRoutes } from './routes/chat';
import { registerHistoryRoutes } from './routes/history';
import { registerMediaRoutes } from './routes/media';
import { registerPlatformRoutes } from './routes/platforms';
import { registerUploadPipelineRoutes } from './routes/upload-pipeline';
import { registerSettingsRoutes } from './routes/settings';
import { registerAdminRoutes } from './routes/admin';
import { registerResourceRoutes } from './routes/resources';

// Initialize Registry
export const registry = new OpenAPIRegistry();

// Register all routes
registerAiRoutes(registry);
registerUploadRoutes(registry);
registerChatRoutes(registry);
registerHistoryRoutes(registry);
registerMediaRoutes(registry);
registerPlatformRoutes(registry);
registerUploadPipelineRoutes(registry);
registerSettingsRoutes(registry);
registerAdminRoutes(registry);
registerResourceRoutes(registry);

export { z };

/**
 * Generates the OpenAPI v3.0.0 document for the application.
 * This is called by the /api/openapi.json route.
 */
export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Social Studio API',
      description: 'Centralized API Documentation for Next.js Route Handlers',
    },
    servers: [{ url: '/api' }],
  });
}
