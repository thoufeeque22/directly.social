import { NextResponse } from 'next/server';
import { getByosConfig, saveByosConfig } from '@/lib/byos/service';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });
  const config = await getByosConfig(session.user.id);
  return NextResponse.json({ config });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });
  try {
    const data = await req.json();
    const config = await saveByosConfig(session.user.id, data);
    return NextResponse.json({ config });
  } catch {
    return new NextResponse('Invalid input', { status: 400 });
  }
}
