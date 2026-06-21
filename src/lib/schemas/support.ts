import { z } from '@/lib/api/zod-openapi';

export const MIN_MESSAGE_LENGTH = 10;
export const MAX_MESSAGE_LENGTH = 1000;

export const SUPPORT_TOPICS = {
  general_inquiry: 'General Inquiry',
  bug_report: 'Bug Report',
  feature_request: 'Feature Request',
  billing: 'Billing',
  other: 'Other',
} as const;

export const SupportTopicSchema = z.enum(
  Object.keys(SUPPORT_TOPICS) as [string, ...string[]]
).openapi('SupportTopic');

export const SupportRequestSchema = z.object({
  topic: SupportTopicSchema,
  message: z.string()
    .min(MIN_MESSAGE_LENGTH, { message: `Message must be at least ${MIN_MESSAGE_LENGTH} characters long` })
    .max(MAX_MESSAGE_LENGTH, { message: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters` }),
}).openapi('SupportRequest');

export type SupportTopic = z.infer<typeof SupportTopicSchema>;
export type SupportRequestInput = z.infer<typeof SupportRequestSchema>;

