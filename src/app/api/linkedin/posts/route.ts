import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { SubscriptionTier } from '@prisma/client';
import { decryptLinkedInToken } from '@/lib/platforms/linkedin/encrypt';
import { publishLinkedInPost } from '@/lib/platforms/linkedin/post';
import { wipeLinkedInData } from '@/lib/platforms/linkedin/wipe';
import { LinkedInTokenRevokedError } from '@/lib/platforms/linkedin/types';
import { buildMemberUrn } from '@/lib/platforms/linkedin/client';

/** Free tiers that are not permitted to schedule LinkedIn posts. */
const FREE_TIERS = new Set<SubscriptionTier>([SubscriptionTier.FREE_STARTER, SubscriptionTier.FREE_HACKER]);

/**
 * POST /api/linkedin/posts
 * Publishes a text post to the user's LinkedIn Member Profile.
 * Returns 403 for Free Tier users (blueprint §4 — Decoy Pricing enforcement).
 */
export async function POST(req: Request): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  const billing = await prisma.billingProfile.findUnique({ where: { userId } });
  const tier = billing?.subscriptionTier ?? SubscriptionTier.FREE_STARTER;

  if (FREE_TIERS.has(tier)) {
    return NextResponse.json(
      { error: 'LinkedIn posting requires a Pro or higher subscription.' },
      { status: 403 },
    );
  }

  const body = (await req.json()) as { text?: string };
  if (!body.text?.trim()) {
    return NextResponse.json({ error: 'Post text is required.' }, { status: 400 });
  }

  const account = await prisma.account.findFirst({
    where: { userId, provider: 'linkedin' },
    select: { access_token: true, providerAccountId: true },
  });

  if (!account?.access_token) {
    return NextResponse.json({ error: 'LinkedIn account not connected.' }, { status: 409 });
  }

  try {
    const accessToken = decryptLinkedInToken(account.access_token);
    const authorUrn = buildMemberUrn(account.providerAccountId);
    const result = await publishLinkedInPost(accessToken, { authorUrn, text: body.text });
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof LinkedInTokenRevokedError) {
      await wipeLinkedInData(userId, 'token_revoked');
      return NextResponse.json({ error: 'LinkedIn token revoked. Please reconnect.' }, { status: 401 });
    }
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Post failed: ${msg}` }, { status: 500 });
  }
}
