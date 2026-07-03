const https = require('https');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const API_KEY = process.env.BETTERSTACK_API_KEY;

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
  console.log('Fetching monitors...');
  const res = await fetchMonitors();
  const monitors = res.data || [];

  for (const m of monitors) {
    if (m.attributes.pronounceable_name === 'Meta Graph API') {
      console.log(`Fixing Meta Graph API (ID: ${m.id})...`);
      await updateMonitor(m.id, {
        url: 'https://graph.facebook.com',
        monitor_type: 'expected_status_code',
        expected_status_codes: [400]
      });
      console.log('✅ Fixed Meta Graph API (now expecting 400 Bad Request)');
    }
  }
}

run();
