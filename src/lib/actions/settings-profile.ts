'use server';

import { protectedAction } from '@/lib/core/action-utils';
import { prisma } from '@/lib/core/prisma';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters').optional(),
  personalNotes: z.string().max(2000, 'Notes must be under 2000 characters').optional(),
});

export async function getUserProfileAction() {
  return protectedAction(async function getUserProfile(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, image: true, personalNotes: true }
      });
      return { success: true, user };
    } catch (err: unknown) {
      return { success: false, error: 'Failed to load user profile.' };
    }
  });
}

export async function updateUserProfileAction(data: { name?: string; personalNotes?: string }) {
  return protectedAction(async function updateUserProfile(userId) {
    try {
      const validated = profileSchema.parse(data);
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(validated.name !== undefined && { name: validated.name }),
          ...(validated.personalNotes !== undefined && { personalNotes: validated.personalNotes }),
        }
      });
      return { success: true, user: { name: user.name, personalNotes: user.personalNotes } };
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        return { success: false, error: err.issues[0]?.message || 'Validation failed' };
      }
      return { success: false, error: 'Failed to update user profile.' };
    }
  });
}
