import { z } from '@/lib/api/zod-openapi';

export const DisconnectSchema = z.object({
  provider: z.string().openapi({ description: 'The platform provider to disconnect (e.g., youtube, tiktok)', example: 'youtube' }),
}).openapi('DisconnectRequest');

export const TikTokProxySchema = z.object({
  code: z.string().openapi({ description: 'OAuth 2.0 authorization code' }),
  grant_type: z.string().openapi({ description: 'The grant type for the request' }),
  client_id: z.string().openapi({ description: 'TikTok Client ID' }),
  client_secret: z.string().openapi({ description: 'TikTok Client Secret' }),
  redirect_uri: z.string().openapi({ description: 'The redirect URI used in the initial request' }),
}).openapi('TikTokProxyRequest');
