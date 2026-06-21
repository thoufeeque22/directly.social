import { z } from '@/lib/api/zod-openapi';

export const BetterStackMonitorStatusSchema = z.enum([
  'up',
  'down',
  'degraded',
  'maintenance',
  'paused',
]);

export const BetterStackMonitorAttributesSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
  monitor_type: z.string().optional(),
  status: BetterStackMonitorStatusSchema,
  last_checked_at: z.string(),
  uptime_percentage: z.number(),
});

export const BetterStackMonitorSchema = z.object({
  id: z.string(),
  type: z.literal('monitor'),
  attributes: BetterStackMonitorAttributesSchema,
});

export const BetterStackResponseSchema = z.object({
  data: z.array(BetterStackMonitorSchema),
});

export type BetterStackMonitorStatus = z.infer<typeof BetterStackMonitorStatusSchema>;
export type BetterStackMonitor = z.infer<typeof BetterStackMonitorSchema>;
export type BetterStackResponse = z.infer<typeof BetterStackResponseSchema>;
