import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { YouTubeUploadSchema, PlatformUploadSchema } from '@/lib/schemas/platform-uploads';

export function registerPlatformUploadRoutes(registry: OpenAPIRegistry) {
  const platforms = ['youtube', 'tiktok', 'instagram', 'facebook'];

  platforms.forEach((platform) => {
    registry.registerPath({
      method: 'post',
      path: `/upload/${platform}`,
      description: `Uploads a video to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
      summary: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Upload`,
      tags: ['Upload'],
      request: {
        body: {
          content: {
            'application/json': {
              schema: platform === 'youtube' ? YouTubeUploadSchema : PlatformUploadSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Upload successful',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                data: z.any(),
              }),
            },
          },
        },
        401: {
          description: 'Unauthorized',
        },
      },
    });
  });
}
