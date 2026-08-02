import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';

/**
 * GET /api/linkedin/status
 * Returns whether the current user has a connected LinkedIn account.
 */
export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ connected: false });
  }

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: 'linkedin' },
    select: { id: true, accountName: true },
  });

  return NextResponse.json({
    connected: !!account,
    accountName: account?.accountName ?? null,
  });
}
