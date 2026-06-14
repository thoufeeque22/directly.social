import type { CapacitorConfig } from '@capacitor/cli';
import { BRAND } from './src/lib/core/brand';
import { APP_CONFIG } from './src/lib/core/config';

const config: CapacitorConfig = {
  appId: 'com.thoufeeque.directly',
  appName: BRAND.name,
  webDir: 'out',
  server: {
    // IMPORTANT: Defaults to production. Use CAPACITOR_URL env var for local/tunnel testing.
    url: process.env.CAPACITOR_URL || APP_CONFIG.urls.production,
    cleartext: true,
    allowNavigation: ['*']
  },
  appendUserAgent: 'DirectlyApp',
  ios: {
    scheme: 'App'
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0F172A",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;
