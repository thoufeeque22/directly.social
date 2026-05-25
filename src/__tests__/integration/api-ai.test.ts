import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { POST as validateKeyPOST } from '@/app/api/ai/validate-key/route';
import { NextRequest } from 'next/server';
import { type Session } from 'next-auth';

vi.mock('@/auth', () => ({ auth: vi.fn() }));
vi.mock('ai', () => ({ generateText: vi.fn() }));
vi.mock('@/lib/core/ai', () => ({ getAIModel: vi.fn() }));

import { auth } from '@/auth';
import { generateText } from 'ai';

describe('POST /api/ai/validate-key', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should return 401 if unauthorized', async () => {
    (auth as Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/ai/validate-key', {
      method: 'POST',
      body: JSON.stringify({ provider: 'openai', apiKey: 'sk-123' }),
    });
    const response = await validateKeyPOST(req);
    expect(response.status).toBe(401);
  });

  it('should return 400 if validation fails', async () => {
    (auth as Mock).mockResolvedValue({ user: { id: 'user_1' } } as Session);
    const req = new NextRequest('http://localhost/api/ai/validate-key', {
      method: 'POST',
      body: JSON.stringify({ provider: 'openai' }),
    });
    const response = await validateKeyPOST(req);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain('Validation failed');
  });

  it('should return 200 on success', async () => {
    (auth as Mock).mockResolvedValue({ user: { id: 'user_1' } } as Session);
    (generateText as Mock).mockResolvedValue({ text: 'OK' } as unknown as Awaited<ReturnType<typeof generateText>>);
    const req = new NextRequest('http://localhost/api/ai/validate-key', {
      method: 'POST',
      body: JSON.stringify({ provider: 'openai', apiKey: 'sk-123' }),
    });
    const response = await validateKeyPOST(req);
    expect(response.status).toBe(200);
  });
});
