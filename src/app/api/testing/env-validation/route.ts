import { NextResponse } from 'next/server';
import { prisma } from '@/lib/core/prisma';

export async function GET() {
  // Safety Switch: Never expose these checks in production
  if (process.env.NEXT_PUBLIC_APP_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden in production environment' }, { status: 403 });
  }

  const status = {
    environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    stripe: {
      connected: false,
      mode: 'unknown',
    },
    database: {
      connected: false,
    },
    resend: {
      connected: false,
    }
  };

  // 1. Check Stripe configuration
  const stripeKey = process.env.STRIPE_SECRET_KEY || '';
  if (stripeKey) {
    status.stripe.connected = true;
    if (stripeKey.startsWith('sk_test_')) {
      status.stripe.mode = 'test';
    } else if (stripeKey.startsWith('sk_live_')) {
      status.stripe.mode = 'live';
    }
  }

  // 2. Check Database connectivity
  try {
    // Perform a lightweight liveness check
    await prisma.$queryRaw`SELECT 1`;
    status.database.connected = true;
  } catch {
    status.database.connected = false;
  }

  // 3. Check Resend configuration
  if (process.env.RESEND_API_KEY) {
    status.resend.connected = true;
  }

  return NextResponse.json(status);
}
