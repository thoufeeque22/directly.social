import { describe, it, expect, vi, beforeEach } from 'vitest';
import { markUpdateAsSeen, getUnseenUpdates } from '@/app/actions/whats-new';
import { prisma } from '@/lib/core/prisma';
import { auth } from '@/auth';
import { Session } from 'next-auth';
import { UpdateLog, UserSeenUpdate, User } from '@prisma/client';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/core/action-utils', () => ({
  protectedAction: vi.fn((action) => action('valid-user', {} as unknown as Session)),
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth as unknown as { mockResolvedValue: (val: any) => void }).mockResolvedValue(null);
      const result = await getUnseenUpdates();
      expect(result).toEqual([]);
    });

    it('should return updates if session exists', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth as unknown as { mockResolvedValue: (val: any) => void }).mockResolvedValue({ user: { id: 'user-1' } } as unknown as Session);
      vi.mocked(prisma.updateLog.findMany).mockResolvedValue([
        { id: 'u1', title: 'T1', description: 'D1', createdAt: new Date(), version: '1' },
      ] as unknown as UpdateLog[]);

      const result = await getUnseenUpdates();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('u1');
    });
  });

  describe('markUpdateAsSeen', () => {
    it('should return error if user not found in DB', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth as unknown as { mockResolvedValue: (val: any) => void }).mockResolvedValue({ user: { id: 'missing-user' } } as unknown as Session);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await markUpdateAsSeen('update-1');
      expect(result).toEqual({ 
        success: false, 
        error: 'User not found in database. Please re-login.' 
      });
    });

    it('should succeed if user exists', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth as unknown as { mockResolvedValue: (val: any) => void }).mockResolvedValue({ user: { id: 'valid-user' } } as unknown as Session);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'valid-user' } as unknown as User);
      vi.mocked(prisma.userSeenUpdate.upsert).mockResolvedValue({} as unknown as UserSeenUpdate);

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
