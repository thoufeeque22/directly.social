import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/core/prisma';

export async function DELETE() {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;

    // Perform database deletion
    // Prisma cascade delete will remove associated accounts, sessions, assets, etc.
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
