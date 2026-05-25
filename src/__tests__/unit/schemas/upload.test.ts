import { describe, it, expect } from 'vitest';
import { UploadInitSchema } from '@/lib/schemas/upload';

describe('Upload Schemas', () => {
  it('should validate valid data', () => {
    const data = {
      title: 'Test',
      platforms: [{ platform: 'youtube', accountId: '123' }]
    };
    expect(UploadInitSchema.safeParse(data).success).toBe(true);
  });

  it('should fail if platforms is empty', () => {
    const data = { title: 'Test', platforms: [] };
    const result = UploadInitSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('At least one platform is required');
    }
  });

  it('should handle customContent as unknown', () => {
    const data = {
      platforms: [{ 
        platform: 'youtube', 
        accountId: '123',
        customContent: { some: 'data' }
      }]
    };
    expect(UploadInitSchema.safeParse(data).success).toBe(true);
  });
});
