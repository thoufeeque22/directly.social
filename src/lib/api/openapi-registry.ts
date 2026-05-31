import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { registerAiRoutes } from './routes/ai';
import { registerUploadRoutes } from './routes/upload';
import { registerChatRoutes } from './routes/chat';
import { registerActivityRoutes } from './routes/activity';
import { registerMediaRoutes } from './routes/media';
import { registerPlatformRoutes } from './routes/platforms';
import { registerUploadPipelineRoutes } from './routes/upload-pipeline';
import { registerSettingsRoutes } from './routes/settings';
import { registerAdminRoutes } from './routes/admin';
import { registerResourceRoutes } from './routes/resources';
import { registerPlatformUploadRoutes } from './routes/platform-uploads';
import { registerByosUploadRoutes } from './routes/byos-upload';
import { registerAuxiliaryRoutes } from './routes/auxiliary';

// Initialize Registry
export const registry = new OpenAPIRegistry();

// Register Security Schemes
registry.registerComponent('securitySchemes', 'sessionCookie', {
  type: 'apiKey',
  in: 'cookie',
  name: 'authjs.session-token',
  description: 'NextAuth.js session cookie',
});

registry.registerComponent('securitySchemes', 'signedToken', {
  type: 'apiKey',
  in: 'query',
  name: 'signature',
  description: 'HMAC signature for restricted media access',
});

// Register all routes
registerAiRoutes(registry);
registerUploadRoutes(registry);
registerChatRoutes(registry);
registerActivityRoutes(registry);
registerMediaRoutes(registry);
registerPlatformRoutes(registry);
registerUploadPipelineRoutes(registry);
registerSettingsRoutes(registry);
registerAdminRoutes(registry);
registerResourceRoutes(registry);
registerPlatformUploadRoutes(registry);
registerByosUploadRoutes(registry);
registerAuxiliaryRoutes(registry);

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
      description: 'Centralized API Documentation for Next.js Route Handlers. Most routes require a valid session cookie.',
    },
    servers: [{ url: '/api' }],
    tags: [
      { name: 'Upload', description: 'Core upload pipeline and platform-specific publishing' },
      { name: 'Media', description: 'Gallery management and asset streaming' },
      { name: 'Admin', description: 'System-wide analytics and maintenance' },
      { name: 'Settings', description: 'User configurations and platform connections' },
      { name: 'AI', description: 'AI assistant and provider validation' },
    ],
  });
}
