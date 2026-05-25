import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { DisconnectSchema, TikTokProxySchema } from '@/lib/schemas/auxiliary';

export function registerAuxiliaryRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/settings/disconnect',
    description: 'Disconnects a social media platform account from the user profile',
    summary: 'Disconnect Platform',
    tags: ['Settings'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: DisconnectSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Successfully disconnected',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });

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

  registry.registerPath({
    method: 'post',
    path: '/upload/cleanup',
    description: 'Deletes a staged file from the temporary storage',
    summary: 'Cleanup Upload',
    tags: ['Upload'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              stagedFileId: z.string().openapi({ description: 'The ID of the file to cleanup' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Cleanup successful',
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/upload/chunks/{uploadId}',
    description: 'Returns a list of already uploaded chunk indices for an active session',
    summary: 'Get Uploaded Chunks',
    tags: ['Upload'],
    request: {
      params: z.object({
        uploadId: z.string().openapi({ description: 'The unique ID for the upload session' }),
      }),
    },
    responses: {
      200: {
        description: 'List of uploaded chunk indices',
        content: {
          'application/json': {
            schema: z.object({
              chunks: z.array(z.number()),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/upload/stage',
    description: 'Uploads a large video file in a single stream and stages it on disk',
    summary: 'Stage Upload',
    tags: ['Upload'],
    request: {
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              file: z.string().openapi({ format: 'binary' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'File staged successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              data: z.object({
                fileId: z.string(),
                fileName: z.string(),
              }),
            }),
          },
        },
      },
    },
  });
}
