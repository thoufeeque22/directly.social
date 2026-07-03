import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { BetterStackMonitor } from '@/lib/schemas/status';

const isDown = (status: string) => status === 'down' || status === 'degraded' || status === 'maintenance';

const coreServices = ['directly-social.vercel.app', 'Core API Gateway', 'Primary Database'];

// Map Better Stack monitor names (or friendly names) to provider names in the Account table
const providerMap: Record<string, string[]> = {
  'YouTube Data API': ['youtube', 'google'],
  'Meta Graph API': ['facebook', 'instagram'],
  'TikTok Publishing API': ['tiktok'],
  // Also checking friendly names just in case
  'YouTube Connection': ['youtube', 'google'],
  'Facebook & Instagram Connection': ['facebook', 'instagram'],
  'TikTok Connection': ['tiktok'],
};

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ hasAlert: false, reason: 'unauthenticated' });
  }

  const apiKey = process.env.BETTERSTACK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ hasAlert: false, reason: 'missing_api_key' });
  }

  try {
    // 1. Fetch user's connected providers from DB (or mock if E2E)
    let userProviders: string[] = [];
    if (process.env.NEXT_PUBLIC_E2E === 'true') {
      userProviders = ['google', 'facebook', 'tiktok'];
    } else {
      const accounts = await prisma.account.findMany({
        where: { userId: session.user.id },
        select: { provider: true }
      });
      userProviders = accounts.map(a => a.provider);
    }

    // 2. Fetch Better Stack monitors
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://uptime.betterstack.com/api/v2/monitors', {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json({ hasAlert: false, reason: 'betterstack_api_error' });
    }

    const json = await res.json();
    const monitors = json.data || [];

    // 3. Evaluate if any relevant monitor is down
    const hasAlert = monitors.some((m: BetterStackMonitor) => {
      const name = m.attributes.pronounceable_name || m.attributes.name;
      const status = m.attributes.status;
      
      if (!isDown(status)) return false;
      
      // Core services affect everyone
      if (coreServices.includes(name)) return true;
      
      // External APIs only affect if user has connected it
      const mappedProviders = providerMap[name];
      if (mappedProviders && mappedProviders.some(p => userProviders.includes(p))) {
        return true;
      }
      
      return false;
    });

    return NextResponse.json({ hasAlert });

  } catch (error) {
    console.error('Error fetching personalized status:', error);
    return NextResponse.json({ hasAlert: false, reason: 'internal_error' }, { status: 500 });
  }
}
