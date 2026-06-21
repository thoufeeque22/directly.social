import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { listByosGallery } from '@/lib/byos/list-gallery';
import { deleteByosAsset } from '@/lib/byos/delete-gallery';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const continuationToken = searchParams.get('continuationToken') || undefined;
  const limit = parseInt(searchParams.get('limit') || '12', 10);

  try {
    const result = await listByosGallery(session.user.id, continuationToken, limit);
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '';
    if (msg === 'BYOS not configured') {
      return NextResponse.json({ error: 'BYOS not configured' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to connect to storage. Verify credentials in settings.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { key } = body;
    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
    }

    await deleteByosAsset(session.user.id, key);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '';
    if (msg === 'BYOS not configured') {
      return NextResponse.json({ error: 'BYOS not configured' }, { status: 400 });
    }
    if (msg === 'AccessDenied') {
      return NextResponse.json({ error: 'Insufficient bucket delete permissions.' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
}
