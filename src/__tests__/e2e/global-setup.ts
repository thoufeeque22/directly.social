
import { execSync } from 'child_process';
import fs from 'fs';

async function globalSetup() {
  console.log('🚀 [GLOBAL SETUP] Starting E2E environment preparation...');

  try {
    // 1. Clear existing activity and temp files
    console.log('🧹 [GLOBAL SETUP] Cleaning up existing activity and temp files...');
    execSync('npm run clear-activity', { stdio: 'inherit' });
    
    // Clear auth cache so that workers are forced to re-seed their isolated test data
    if (fs.existsSync('.auth')) {
      console.log('🧹 [GLOBAL SETUP] Clearing auth state to force lazy re-seeding...');
      fs.rmSync('.auth', { recursive: true, force: true });
    }

    // 2. Run Database Seeding
    console.log('🌱 [GLOBAL SETUP] Seeding global E2E dependencies...');
    
    // Seed what's new (Global state)
    execSync('npm run seed:whats-new', { stdio: 'inherit' });
    
    // Fallback Legacy user (since some tests may bypass the fixture logic entirely)
    execSync('npx tsx src/__tests__/scripts/seed-e2e-user.ts', { stdio: 'inherit' });
    
    console.log('✅ [GLOBAL SETUP] Environment ready.');
  } catch (error) {
    console.error('❌ [GLOBAL SETUP] Failed to prepare environment:', error);
    process.exit(1);
  }
}

export default globalSetup;
