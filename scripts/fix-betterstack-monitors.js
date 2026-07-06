/* eslint-disable */
const https = require('https');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const API_KEY = process.env.BETTERSTACK_API_KEY;

if (!API_KEY) {
  console.error('Error: BETTERSTACK_API_KEY is missing.');
  process.exit(1);
}

function fetchMonitors() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'uptime.betterstack.com',
      port: 443,
      path: '/api/v2/monitors',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.end();
  });
}

function updateMonitor(id, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'uptime.betterstack.com',
      port: 443,
      path: `/api/v2/monitors/${id}`,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('Fetching monitors to fix...');
  const res = await fetchMonitors();
  const monitors = res.data || [];

  for (const m of monitors) {
    const name = m.attributes.pronounceable_name;
    const id = m.id;

    if (name === 'Neon Database') {
      console.log(`Fixing Neon Database (ID: ${id})...`);
      await updateMonitor(id, {
        url: 'aws-0-eu-west-1.pooler.supabase.com',
        port: '6543',
        pronounceable_name: 'Primary Database' // Renamed to reflect Supabase
      });
      console.log('✅ Fixed Primary Database');
    }

    if (name === 'Core API Gateway') {
      console.log(`Fixing Core API Gateway (ID: ${id})...`);
      const authUrl = process.env.AUTH_URL || 'https://roohis-mac.tail8a2e7d.ts.net';
      await updateMonitor(id, {
        url: `${authUrl}/api/status`
      });
      console.log('✅ Fixed Core API Gateway');
    }

    if (name === 'Meta Graph API') {
      console.log(`Fixing Meta Graph API (ID: ${id})...`);
      await updateMonitor(id, {
        url: 'https://www.facebook.com'
      });
      console.log('✅ Fixed Meta Graph API');
    }
  }

  console.log('All fixes applied!');
}

run();
