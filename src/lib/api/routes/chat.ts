import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { ChatRequestSchema } from '@/lib/schemas/chat';

export function registerChatRoutes(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/chat',
    description: 'Handles conversational AI assistant with tool calling',
    summary: 'AI Chat',
    tags: ['AI'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: ChatRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Streaming UI message response',
        content: {
          'text/event-stream': {
            schema: z.string(),
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });
}
