import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';

const providerMap: Record<string, string[]> = {
  'YouTube Data API': ['youtube', 'google'],
  'Meta Graph API': ['facebook', 'instagram'],
  'TikTok Publishing API': ['tiktok'],
  'YouTube Connection': ['youtube', 'google'],
  'Facebook & Instagram Connection': ['facebook', 'instagram'],
  'TikTok Connection': ['tiktok'],
};

export async function GET() {
  const apiKey = process.env.BETTERSTACK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ data: [], incidents: [] });
  }

  const session = await auth();
  let userProviders: string[] | null = null;
  if (session?.user?.id) {
    if (process.env.NEXT_PUBLIC_E2E === 'true') {
      userProviders = ['google', 'facebook', 'tiktok'];
    } else {
      const accounts = await prisma.account.findMany({
        where: { userId: session.user.id },
        select: { provider: true }
      });
      userProviders = accounts.map(a => a.provider);
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const [monitorsRes, incidentsRes] = await Promise.all([
      fetch('https://uptime.betterstack.com/api/v2/monitors', {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: controller.signal,
        next: { revalidate: 30 },
      }),
      fetch('https://uptime.betterstack.com/api/v2/incidents', {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: controller.signal,
        next: { revalidate: 30 },
      })
    ]);
    clearTimeout(timeoutId);
    
    if (monitorsRes.ok && incidentsRes.ok) {
      const monitorsJson = await monitorsRes.json();
      const incidentsJson = await incidentsRes.json();

      if (monitorsJson.data && Array.isArray(monitorsJson.data)) {
        interface RawMonitor {
          id: string;
          type: string;
          attributes: {
            name?: string;
            pronounceable_name?: string;
            uptime_percentage?: number;
            [key: string]: unknown;
          };
        }
        monitorsJson.data = monitorsJson.data.map((m: RawMonitor) => ({
          ...m,
          attributes: {
            ...m.attributes,
            name: m.attributes.pronounceable_name || m.attributes.name || 'Unknown Monitor',
          }
        }));

        // Filter out unconnected external APIs if the user is authenticated
        if (userProviders !== null) {
          monitorsJson.data = monitorsJson.data.filter((m: RawMonitor) => {
            const name = m.attributes.name || '';
            const mappedProviders = providerMap[name];
            if (mappedProviders) {
              return mappedProviders.some(p => userProviders!.includes(p));
            }
            return true;
          });
        }
      }
      return NextResponse.json({ 
        data: monitorsJson.data || [], 
        incidents: incidentsJson.data || [] 
      });
    }
    return NextResponse.json({ error: 'Failed to fetch status from Better Stack' }, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch status from Better Stack' }, { status: 500 });
  }
}
