import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerByosGetSettings } from './settings/byos-get';
import { registerByosSaveSettings } from './settings/byos-save';
import { registerDisconnectRoutes } from './settings/disconnect';

export function registerSettingsRoutes(registry: OpenAPIRegistry) {
  registerByosGetSettings(registry);
  registerByosSaveSettings(registry);
  registerDisconnectRoutes(registry);
}
