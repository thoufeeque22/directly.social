import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { SubscriptionService } from '@/lib/billing/subscription-service';

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = await SubscriptionService.createCustomerPortalSession(session.user.id);

    return NextResponse.json({ url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[STRIPE_PORTAL]', message);
    return NextResponse.json({ error: 'Internal Error', message }, { status: 500 });
  }
}
