import { prisma } from '@/lib/core/prisma';

export class UserService {
  /**
   * Permanently deletes a user and all associated cascading data.
   * @param userId The ID of the user to delete
   */
  static async deleteUser(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required for deletion');
    }

    // Prisma cascade delete will remove associated accounts, sessions, assets, etc.
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}
