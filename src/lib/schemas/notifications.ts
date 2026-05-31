import { z } from '@/lib/api/zod-openapi';

export const NotificationTypeSchema = z.enum([
  'INFO',
  'SUCCESS',
  'WARNING',
  'ERROR',
]).openapi('NotificationType');

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: NotificationTypeSchema,
  message: z.string(),
  isRead: z.boolean(),
  link: z.string().nullable().optional(),
  createdAt: z.string(),
}).openapi('Notification');

export const MarkAsReadSchema = z.object({
  id: z.string(),
}).openapi('MarkAsRead');

export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
