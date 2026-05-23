import { NextResponse } from 'next/server';
import { PLATFORMS } from '@/lib/core/constants';

export async function GET() {
  return NextResponse.json(PLATFORMS);
}
