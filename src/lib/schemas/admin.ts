import { z } from '@/lib/api/zod-openapi';

export const SystemMetricSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  timestamp: z.string().openapi({ format: 'date-time' }),
}).openapi('SystemMetric');

export const AggregateResultSchema = z.object({
  key: z.string(),
  value: z.number(),
  event: z.string(),
  date: z.string(),
}).openapi('AggregateResult');
