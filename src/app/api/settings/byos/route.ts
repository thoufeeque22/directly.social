import { NextResponse } from 'next/server';
import { getByosConfig, saveByosConfig } from '@/lib/byos/service';
import { auth } from '@/auth';
import { ByosConfigSchema } from '@/lib/schemas/settings';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });
  const config = await getByosConfig(session.user.id);
  
  if (config) {
    config.secretAccessKey = '********';
  }
  
  return NextResponse.json({ config });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });
  try {
    const data = await req.json();
    const validated = ByosConfigSchema.parse(data);
    
    if (validated.secretAccessKey === '********') {
      const existing = await getByosConfig(session.user.id);
      if (existing) {
        validated.secretAccessKey = existing.secretAccessKey;
      }
    }
    
    const config = await saveByosConfig(session.user.id, validated);
    
    if (config) {
      config.secretAccessKey = '********';
    }
    
    return NextResponse.json({ config });
  } catch {
    return new NextResponse('Invalid input', { status: 400 });
  }
}
