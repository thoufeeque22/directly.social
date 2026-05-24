import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thoufeeque.socialstudio',
  appName: 'Social Studio',
  webDir: 'out',
  server: {
    // IMPORTANT: Defaults to production. Use CAPACITOR_URL env var for local/tunnel testing.
    url: process.env.CAPACITOR_URL || 'https://social-studio-app.vercel.app',
    cleartext: true,
    allowNavigation: ['*']
  },
  appendUserAgent: 'SocialStudioApp',
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
