import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { registerAiRoutes } from './routes/ai';
import { registerUploadRoutes } from './routes/upload';

// Initialize Registry
export const registry = new OpenAPIRegistry();

// Register all routes
registerAiRoutes(registry);
registerUploadRoutes(registry);

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
