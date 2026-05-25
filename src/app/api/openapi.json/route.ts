import { NextResponse } from 'next/server';
import { generateOpenApiDocument } from '@/lib/api/openapi-registry';

export const dynamic = 'force-static';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const spec = generateOpenApiDocument();
  return NextResponse.json(spec);
}
