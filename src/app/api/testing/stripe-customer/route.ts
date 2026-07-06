import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  // Next.js-native lightweight mock:
  // We return a hardcoded simulated Stripe Customer object reflecting a negative
  // account balance (Stripe credit) for the gamification testing scenarios.
  return NextResponse.json({
    id: `cus_${email.split('@')[0]}`,
    email,
    balance: -1000,
  });
}
