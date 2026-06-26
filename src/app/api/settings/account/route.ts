import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { UserService } from '@/lib/services/user-service';

export async function DELETE() {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Use domain service to delete user
    await UserService.deleteUser(userId);

    return NextResponse.json({ success: true, message: 'Account deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error deleting account:', message);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal Server Error' } },
      { status: 500 }
    );
  }
}
