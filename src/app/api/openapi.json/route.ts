import { NextResponse } from 'next/server';
import { generateOpenApiDocument } from '@/lib/api/openapi-registry';
import { auth } from '@/auth';

export const dynamic = 'force-static';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  // Production Protection
  if (process.env.NODE_ENV === 'production') {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  const spec = generateOpenApiDocument();
  return NextResponse.json(spec);
}
