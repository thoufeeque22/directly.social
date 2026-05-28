import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRecentUpdates } from '@/app/actions/whats-new-activity';
import { prisma } from '@/lib/core/prisma';
import { UpdateLog } from '@prisma/client';

vi.mock('@/lib/core/prisma', () => ({
  prisma: {
    updateLog: {
      findMany: vi.fn(),
    },
  },
}));

describe('Whats New Activity Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return recent updates from the DB', async () => {
    const mockUpdates = [
      { id: 'u1', title: 'T1', description: 'D1', createdAt: new Date('2026-05-22T00:00:00.000Z'), version: '1' },
      { id: 'u2', title: 'T2', description: 'D2', createdAt: new Date('2026-05-21T00:00:00.000Z'), version: '2' },
    ];
    vi.mocked(prisma.updateLog.findMany).mockResolvedValue(mockUpdates as unknown as UpdateLog[]);

    const result = await getRecentUpdates(2);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('u1');
    expect(result[0].date).toBe('2026-05-22T00:00:00.000Z');
    expect(prisma.updateLog.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      take: 2,
    });
  });

  it('should handle errors gracefully and return empty array', async () => {
    vi.mocked(prisma.updateLog.findMany).mockRejectedValue(new Error('DB connection failure'));

    const result = await getRecentUpdates(5);
    expect(result).toEqual([]);
  });
});
