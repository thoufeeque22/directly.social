import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { validateAIKeyAction } from '@/lib/actions/ai';
import { saveByosConfigAction, getByosConfigAction } from '@/lib/actions/settings';
import { auth } from '@/auth';
import { generateText } from 'ai';
import { saveByosConfig, getByosConfig } from '@/lib/byos/service';
import { type Session } from 'next-auth';

vi.mock('@/auth', () => ({ auth: vi.fn() }));
vi.mock('ai', () => ({ generateText: vi.fn() }));
vi.mock('@/lib/core/ai', () => ({ getAIModel: vi.fn() }));
vi.mock('@/lib/byos/service', () => ({
  saveByosConfig: vi.fn(),
  getByosConfig: vi.fn(),
}));

// Mock revalidateDashboard to avoid side effects
vi.mock('@/lib/core/action-utils', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    revalidateDashboard: vi.fn(),
  };
});

describe('Server Actions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('validateAIKeyAction', () => {
    it('should validate correctly when authorized', async () => {
      (auth as Mock).mockResolvedValue({ user: { id: 'user_1' } } as Session);
      (generateText as Mock).mockResolvedValue({ text: 'OK' } as any);
      
      const result = await validateAIKeyAction({ provider: 'openai', apiKey: 'sk-123' });
      expect(result.success).toBe(true);
    });

    it('should throw if unauthorized', async () => {
      (auth as Mock).mockResolvedValue(null);
      await expect(validateAIKeyAction({ provider: 'openai', apiKey: 'sk-123' }))
        .rejects.toThrow('Unauthorized');
    });
  });

  describe('Settings Actions', () => {
    it('should retrieve BYOS config', async () => {
      (auth as Mock).mockResolvedValue({ user: { id: 'user_1' } } as Session);
      (getByosConfig as Mock).mockResolvedValue({ provider: 'S3', bucketName: 'test' });
      
      const result = await getByosConfigAction();
      expect(result.config.provider).toBe('S3');
    });

    it('should save BYOS config', async () => {
      (auth as Mock).mockResolvedValue({ user: { id: 'user_1' } } as Session);
      const mockData = { 
        provider: 'S3', bucketName: 'test', endpoint: 'http://localhost', 
        region: 'us-east-1', accessKeyId: '123', secretAccessKey: '456', 
        pathPrefix: '', keepFiles: true 
      };
      (saveByosConfig as Mock).mockResolvedValue(mockData);
      
      const result = await saveByosConfigAction(mockData);
      expect(result.success).toBe(true);
      expect(saveByosConfig).toHaveBeenCalled();
    });
  });
});
