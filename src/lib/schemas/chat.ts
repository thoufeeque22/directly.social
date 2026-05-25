import { z } from '@/lib/api/zod-openapi';

export const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'tool']),
    content: z.string(),
    id: z.string().optional(),
    tool_call_id: z.string().optional(),
    name: z.string().optional(),
  })).openapi({ description: 'Array of messages in the conversation' }),
  byokConfigs: z.record(z.string(), z.object({
    modelId: z.string().optional(),
    apiKey: z.string().optional(),
  })).optional().openapi({ description: 'Bring-Your-Own-Key configurations' }),
}).openapi('ChatRequest');
