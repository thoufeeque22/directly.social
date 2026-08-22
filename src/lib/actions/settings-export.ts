'use server';

import { protectedAction } from '@/lib/core/action-utils';
import { inngest } from '@/lib/inngest/client';
import { prisma } from '@/lib/core/prisma';

export async function triggerDataExportAction() {
  if (process.env.E2E_TEST_MODE === 'true') {
    return { success: true };
  }

  return protectedAction(async function triggerDataExport(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });
      
      if (!user?.email) {
        return { success: false, error: 'User email not found' };
      }

      await inngest.send({
        name: 'user.data.export.requested',
        data: {
          userId,
          email: user.email,
        }
      });

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: 'Failed to trigger data export.' };
    }
  });
}
