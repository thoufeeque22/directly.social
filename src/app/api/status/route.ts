import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.BETTERSTACK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ data: [] });
  }

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
      if (json.data && Array.isArray(json.data)) {
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
        json.data = json.data.map((m: RawMonitor) => ({
          ...m,
          attributes: {
            ...m.attributes,
            name: m.attributes.pronounceable_name || m.attributes.name || 'Unknown Monitor',
          }
        }));
      }
      return NextResponse.json(json);
    }
    return NextResponse.json({ error: 'Failed to fetch status from Better Stack' }, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch status from Better Stack' }, { status: 500 });
  }
}
