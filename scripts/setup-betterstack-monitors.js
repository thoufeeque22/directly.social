/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const API_KEY = process.env.BETTERSTACK_API_KEY;

if (!API_KEY) {
  console.error('Error: BETTERSTACK_API_KEY environment variable is missing.');
  console.error('Please add it to your .env file and run again.');
  process.exit(1);
}

const monitorsToCreate = [
  {
    monitor_type: 'expected_status_code',
    url: 'https://directly.social/api/status', // replace with actual production URL if different
    name: 'Core API Gateway',
    check_frequency: 180, // 3 minutes
    monitor_group_id: null,
  },
  {
    monitor_type: 'port',
    url: 'db.neon.tech', // replace with actual Neon DB host
    port: '5432',
    name: 'Neon Database',
    check_frequency: 180,
    monitor_group_id: null,
  },
  {
    monitor_type: 'heartbeat',
    name: 'Background Job Scheduler',
    check_frequency: 60, // Heartbeat expected every 60s
  },
  {
    monitor_type: 'expected_status_code',
    url: 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
    name: 'YouTube Data API',
    check_frequency: 180,
  },
  {
    monitor_type: 'expected_status_code',
    url: 'https://graph.facebook.com/status',
    name: 'Meta Graph API',
    check_frequency: 180,
  },
  {
    monitor_type: 'expected_status_code',
    url: 'https://developers.tiktok.com',
    name: 'TikTok Publishing API',
    check_frequency: 180,
  }
];

function createMonitor(monitor) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(monitor);
    const options = {
      hostname: 'uptime.betterstack.com',
      port: 443,
      path: '/api/v2/monitors',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('Creating Better Stack monitors...');
  for (const monitor of monitorsToCreate) {
    try {
      console.log(`Creating: ${monitor.name}`);
      const res = await createMonitor(monitor);
      console.log(`✅ Created ${monitor.name}. ID: ${res.data.id}`);
      if (monitor.monitor_type === 'heartbeat') {
        console.log(`\n🚨 ACTION REQUIRED: Add the following heartbeat URL to your .env file as BETTERSTACK_HEARTBEAT_URL:`);
        console.log(`   ${res.data.attributes.url}\n`);
      }
    } catch (error) {
      console.error(`❌ Failed to create ${monitor.name}:`, error.message);
    }
  }
  console.log('Done.');
}

run();
