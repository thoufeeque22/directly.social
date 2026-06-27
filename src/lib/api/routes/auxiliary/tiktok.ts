import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { TikTokProxySchema } from '@/lib/schemas/auxiliary';

export function registerTikTokProxyRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/tiktok-proxy',
    description: 'Proxies TikTok OAuth 2.0 token requests to bypass PKCE and client_id naming issues',
    summary: 'TikTok OAuth Proxy',
    tags: ['AI'],
    request: {
      body: {
        content: {
          'application/x-www-form-urlencoded': {
            schema: TikTokProxySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Successfully proxied token response',
      },
    },
  });
}
