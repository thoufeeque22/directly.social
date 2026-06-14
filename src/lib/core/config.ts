/**
 * Technical Application Configuration
 * 
 * Centralizing technical constants like App IDs, User Agents, and 
 * infrastructure URLs.
 */

export const APP_CONFIG = {
  /**
   * Mobile Bundle Identifier
   */
  appId: 'com.thoufeeque.directly',

  /**
   * Custom User Agent suffix used to detect the native app wrapper
   */
  userAgent: 'DirectlyApp',

  /**
   * URLs for environments
   */
  urls: {
    production: 'https://directly.social',
    vercel: 'https://directly-social.vercel.app',
  }
} as const;
