import { NextRequest, NextResponse } from 'next/server';
import { BetterStackResponse, BetterStackMonitor } from '@/lib/schemas/status';

const createMonitor = (
  id: string,
  name: string,
  status: 'up' | 'down' | 'degraded' | 'maintenance',
  uptime: number
): BetterStackMonitor => ({
  id,
  type: 'monitor',
  attributes: {
    name,
    status,
    last_checked_at: new Date().toISOString(),
    uptime_percentage: uptime,
  },
});

const getMockData = (scenario: string | null): BetterStackResponse => {
  const s = scenario || 'all-healthy';
  const monitors: BetterStackMonitor[] = [
    createMonitor('1', 'Web Application', 'up', 99.99),
    createMonitor('2', 'Core API Gateway', s === 'major-outage' ? 'down' : 'up', 99.95),
    createMonitor('3', 'Background Job Scheduler', s === 'major-outage' ? 'down' : (s === 'maintenance' ? 'maintenance' : 'up'), 99.9),
    createMonitor('4', 'Neon Database', s === 'maintenance' ? 'maintenance' : 'up', 99.99),
    createMonitor('5', 'TikTok Publishing API', s === 'degraded-performance' ? 'degraded' : 'up', 99.5),
    createMonitor('6', 'Meta Graph API', s === 'degraded-performance' ? 'degraded' : (s === 'major-outage' ? 'down' : 'up'), 99.4),
    createMonitor('7', 'YouTube Data API', 'up', 99.9),
  ];
  return { data: monitors };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scenario = searchParams.get('scenario');

  if (scenario === 'error') {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  const apiKey = process.env.BETTERSTACK_API_KEY;
  if (apiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch('https://uptime.betterstack.com/api/v2/monitors', {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: controller.signal,
        next: { revalidate: 30 },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        return NextResponse.json(json);
      }
    } catch {
      // Fallback on error or timeout
    }
  }

  return NextResponse.json(getMockData(scenario));
}
