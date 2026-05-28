import { describe, it, expect } from 'vitest';
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
    expect(data.paths['/activity']).toBeDefined();
    expect(data.paths['/media']).toBeDefined();
    expect(data.paths['/platforms']).toBeDefined();
    expect(data.paths['/upload/initialize']).toBeDefined();
    expect(data.paths['/upload/chunk']).toBeDefined();
    expect(data.paths['/upload/assemble']).toBeDefined();
    expect(data.paths['/settings/byos']).toBeDefined();
    expect(data.paths['/admin/analytics']).toBeDefined();
    expect(data.paths['/admin/aggregate']).toBeDefined();
    expect(data.paths['/activity/{id}']).toBeDefined();
    expect(data.paths['/media/{fileId}']).toBeDefined();
    expect(data.paths['/upload/youtube']).toBeDefined();
    expect(data.paths['/upload/tiktok']).toBeDefined();
    expect(data.paths['/upload/byos/presign']).toBeDefined();
    expect(data.paths['/upload/byos/complete']).toBeDefined();
    expect(data.paths['/settings/disconnect']).toBeDefined();
    expect(data.paths['/tiktok-proxy']).toBeDefined();
    expect(data.paths['/upload/cleanup']).toBeDefined();
    expect(data.paths['/upload/stage']).toBeDefined();
  });
});
