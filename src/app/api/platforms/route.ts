import { NextResponse } from 'next/server';
import { PLATFORMS } from '@/lib/core/constants';

import { auth } from '@/auth';
import { PlatformCapabilityService } from '@/lib/services/platform-capability';

const capabilityService = new PlatformCapabilityService();

export async function GET() {
  const session = await auth();
  const isFree = !session?.user?.role || session.user.role === 'USER';

  const viewPlatforms = capabilityService.getCapabilities(isFree);

  return NextResponse.json(viewPlatforms);
}
