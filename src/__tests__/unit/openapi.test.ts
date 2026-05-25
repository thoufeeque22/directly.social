import { describe, it, expect, vi } from 'vitest';
import { GET } from '@/app/api/openapi.json/route';

describe('OpenAPI API Route', () => {
  it('should return a valid OpenAPI JSON spec', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.openapi).toBe('3.0.0');
    expect(data.info.title).toBe('Social Studio API');
    expect(data.paths['/upload/init']).toBeDefined();
    expect(data.paths['/ai/validate-key']).toBeDefined();
    expect(data.paths['/chat']).toBeDefined();
    expect(data.paths['/history']).toBeDefined();
  });
});
