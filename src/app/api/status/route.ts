import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.BETTERSTACK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ data: [], incidents: [] });
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
