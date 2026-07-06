/* eslint-disable */
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
    monitor_type: 'status',
    url: 'https://directly.social/api/status', // replace with actual production URL if different
    pronounceable_name: 'Core API Gateway',
    check_frequency: 180, // 3 minutes
    monitor_group_id: null,
  },
  {
    monitor_type: 'tcp',
    url: 'db.neon.tech', // replace with actual Neon DB host
    port: '5432',
    pronounceable_name: 'Neon Database',
    check_frequency: 180,
    monitor_group_id: null,
  },
  // Heartbeat monitors cannot be created via this specific API endpoint
  // Please create "Background Job Scheduler" manually in the UI.
  {
    monitor_type: 'status',
    url: 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
    pronounceable_name: 'YouTube Data API',
    check_frequency: 180,
  },
  {
    monitor_type: 'status',
    url: 'https://graph.facebook.com/status',
    pronounceable_name: 'Meta Graph API',
    check_frequency: 180,
  },
  {
    monitor_type: 'status',
    url: 'https://developers.tiktok.com',
    pronounceable_name: 'TikTok Publishing API',
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

function getExistingMonitors() {
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
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

async function run() {
  console.log('Fetching existing Better Stack monitors...');
  let existingMonitors = [];
  try {
    const res = await getExistingMonitors();
    existingMonitors = res.data || [];
  } catch (err) {
    console.error('Failed to fetch existing monitors:', err.message);
    return;
  }

  const existingNames = new Set(existingMonitors.map(m => m.attributes.pronounceable_name));

  console.log('Creating Better Stack monitors...');
  for (const monitor of monitorsToCreate) {
    if (existingNames.has(monitor.pronounceable_name)) {
      console.log(`⏭️  Skipping: ${monitor.pronounceable_name} (already exists)`);
      continue;
    }

    try {
      console.log(`Creating: ${monitor.pronounceable_name}`);
      const res = await createMonitor(monitor);
      console.log(`✅ Created ${monitor.pronounceable_name}. ID: ${res.data.id}`);
    } catch (error) {
      console.error(`❌ Failed to create ${monitor.pronounceable_name}:`, error.message);
    }
  }
  
  console.log('\n🚨 NOTE: Better Stack does not support creating Heartbeat monitors via this endpoint.');
  console.log('   Please create the "Background Job Scheduler" monitor manually in the UI,');
  console.log('   and copy the provided URL into your .env file as BETTERSTACK_HEARTBEAT_URL.\n');
  console.log('Done.');
}

run();
