import { FullConfig } from '@playwright/test';
import { execSync } from 'child_process';

async function globalSetup(config: FullConfig) {
  console.log('🚀 [GLOBAL SETUP] Starting E2E environment preparation...');

  try {
    // 1. Clear existing activity and temp files
    console.log('🧹 [GLOBAL SETUP] Cleaning up existing activity and temp files...');
    execSync('npm run clear-activity', { stdio: 'inherit' });

    // 2. Run Database Seeding
    console.log('🌱 [GLOBAL SETUP] Seeding database for E2E tests...');
    execSync('npm run seed:e2e', { stdio: 'inherit' });
    execSync('npm run seed:schedule', { stdio: 'inherit' });
    
    console.log('✅ [GLOBAL SETUP] Environment ready.');
  } catch (error) {
    console.error('❌ [GLOBAL SETUP] Failed to prepare environment:', error);
    process.exit(1);
  }
}

export default globalSetup;
