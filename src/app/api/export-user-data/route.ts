import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { triggerDataExportAction } from '@/lib/actions/settings-export';

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({ success: true });
}
