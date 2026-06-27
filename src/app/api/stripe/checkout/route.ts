import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import { SubscriptionService } from '@/lib/billing/subscription-service';

const checkoutRequestSchema = z.object({
  tierId: z.enum(['free-starter', 'free-hacker', 'power-pass', 'creator-pro', 'cloud-pro', 'agency-pro', 'lifetime-deal']),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let parsedBody;
    try {
      parsedBody = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = checkoutRequestSchema.safeParse(parsedBody);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid tierId' }, { status: 400 });
    }

    const { tierId } = validation.data;

    const url = await SubscriptionService.createCheckoutSession(session.user.id, session.user.email || '', tierId);

    return NextResponse.json({ url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[STRIPE_CHECKOUT]', message);
    return NextResponse.json({ error: 'Internal Error', message }, { status: 500 });
  }
}
