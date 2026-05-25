import { describe, it, expect } from 'vitest';
import { AIKeyValidationSchema } from '@/lib/schemas/ai';

describe('AI Schemas', () => {
  it('should validate valid data', () => {
    const data = { provider: 'openai', apiKey: 'sk-123' };
    expect(AIKeyValidationSchema.safeParse(data).success).toBe(true);
  });

  it('should fail on missing fields', () => {
    const data = { provider: 'openai' };
    expect(AIKeyValidationSchema.safeParse(data).success).toBe(false);
  });
});
