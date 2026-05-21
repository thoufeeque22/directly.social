import { describe, it, expect, vi, beforeEach } from 'vitest';
import { markUpdateAsSeen, getUnseenUpdates } from '@/app/actions/whats-new';
import { prisma } from '@/lib/core/prisma';
import { auth } from '@/auth';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/core/action-utils', () => ({
  protectedAction: vi.fn((action) => action('valid-user', {})),
  revalidateDashboard: vi.fn(),
}));

vi.mock('@/lib/core/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    updateLog: {
      findMany: vi.fn(),
    },
    userSeenUpdate: {
      upsert: vi.fn(),
    },
  },
}));

describe('What\'s New Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUnseenUpdates', () => {
    it('should return empty array if no session', async () => {
      vi.mocked(auth).mockResolvedValue(null);
      const result = await getUnseenUpdates();
      expect(result).toEqual([]);
    });

    it('should return updates if session exists', async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } } as any);
      vi.mocked(prisma.updateLog.findMany).mockResolvedValue([
        { id: 'u1', title: 'T1', description: 'D1', createdAt: new Date(), version: '1' },
      ] as any);

      const result = await getUnseenUpdates();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('u1');
    });
  });

  describe('markUpdateAsSeen', () => {
    it('should return error if user not found in DB', async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: 'missing-user' } } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await markUpdateAsSeen('update-1');
      expect(result).toEqual({ 
        success: false, 
        error: 'User not found in database. Please re-login.' 
      });
    });

    it('should succeed if user exists', async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: 'valid-user' } } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'valid-user' } as any);
      vi.mocked(prisma.userSeenUpdate.upsert).mockResolvedValue({} as any);

      const result = await markUpdateAsSeen('update-1');
      expect(result).toEqual({ success: true });
      expect(prisma.userSeenUpdate.upsert).toHaveBeenCalledWith(expect.objectContaining({
        where: {
          userId_updateId: {
            userId: 'valid-user',
            updateId: 'update-1',
          },
        },
      }));
    });
  });
});
