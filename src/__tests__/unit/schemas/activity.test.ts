import { describe, it, expect } from 'vitest';
import { ActivityQuerySchema } from '@/lib/schemas/activity';

describe('Activity Schemas', () => {
  it('should coerce limit to number', () => {
    const data = { limit: '50' };
    const result = ActivityQuerySchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(50);
    }
  });

  it('should enforce min/max limit', () => {
    expect(ActivityQuerySchema.safeParse({ limit: 0 }).success).toBe(false);
    expect(ActivityQuerySchema.safeParse({ limit: 201 }).success).toBe(false);
  });
});
