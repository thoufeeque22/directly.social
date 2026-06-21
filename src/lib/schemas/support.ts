import { z } from '@/lib/api/zod-openapi';

export const SupportTopicSchema = z.enum([
  'General Inquiry',
  'Bug Report',
  'Feature Request',
  'Billing',
  'Other',
]).openapi('SupportTopic');

export const SupportRequestSchema = z.object({
  topic: SupportTopicSchema,
  message: z.string()
    .min(10, { message: 'Message must be at least 10 characters long' })
    .max(1000, { message: 'Message must not exceed 1000 characters' }),
}).openapi('SupportRequest');

export type SupportTopic = z.infer<typeof SupportTopicSchema>;
export type SupportRequestInput = z.infer<typeof SupportRequestSchema>;
