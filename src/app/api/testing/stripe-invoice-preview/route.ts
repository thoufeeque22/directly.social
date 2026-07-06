import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  // Next.js-native lightweight mock:
  // We return a simulated Stripe Upcoming Invoice object showing $0 amount due 
  // when the Grand Prize is unlocked or credits are applied in the gamification testing scenarios.
  return NextResponse.json({
    amount_due: 0,
    subtotal: 1000,
    customer_email: email,
  });
}
