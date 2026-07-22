import { prisma } from '@/lib/core/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.type === 'revoke' || body.type === 'delete') {
      const accountId = body.account_id;
      if (accountId) {
        console.log(`Revoking TikTok access and deleting data for account: ${accountId}`);
        await prisma.account.deleteMany({
          where: { provider: 'tiktok', providerAccountId: accountId }
        });
      }
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
