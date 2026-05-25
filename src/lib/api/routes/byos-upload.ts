import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerByosPresignRoutes } from './byos-upload/presign';
import { registerByosCompleteRoutes } from './byos-upload/complete';

export function registerByosUploadRoutes(registry: OpenAPIRegistry) {
  registerByosPresignRoutes(registry);
  registerByosCompleteRoutes(registry);
}
