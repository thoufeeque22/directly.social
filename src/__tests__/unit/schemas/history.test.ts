import { describe, it, expect } from 'vitest';
import { HistoryQuerySchema } from '@/lib/schemas/history';

describe('History Schemas', () => {
  it('should coerce limit to number', () => {
    const data = { limit: '50' };
    const result = HistoryQuerySchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(50);
    }
  });

  it('should enforce min/max limit', () => {
    expect(HistoryQuerySchema.safeParse({ limit: 0 }).success).toBe(false);
    expect(HistoryQuerySchema.safeParse({ limit: 201 }).success).toBe(false);
  });
});
