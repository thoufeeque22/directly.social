import { NextResponse } from 'next/server';
import { getLifetimeLicensesLeft } from '@/app/actions/pricing';

export async function GET() {
  try {
    const count = await getLifetimeLicensesLeft();
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
