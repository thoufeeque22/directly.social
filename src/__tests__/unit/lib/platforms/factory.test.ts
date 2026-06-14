import { describe, it, expect } from 'vitest';
import { getPlatformActivity } from '@/lib/platforms/factory';
import { InstagramActivity } from '@/lib/platforms/instagram-activity';
import { YouTubeActivity } from '@/lib/platforms/youtube-activity';
import { TikTokActivity } from '@/lib/platforms/tiktok-activity';
import { FacebookActivity } from '@/lib/platforms/facebook-activity';

describe('ActivityRegistry', () => {
  it('should return InstagramActivity for "instagram"', () => {
    const activity = getPlatformActivity('instagram');
    expect(activity).toBeInstanceOf(InstagramActivity);
  });

  it('should return YouTubeActivity for "youtube"', () => {
    const activity = getPlatformActivity('youtube');
    expect(activity).toBeInstanceOf(YouTubeActivity);
  });

  it('should return TikTokActivity for "tiktok"', () => {
    const activity = getPlatformActivity('tiktok');
    expect(activity).toBeInstanceOf(TikTokActivity);
  });

  it('should return FacebookActivity for "facebook"', () => {
    const activity = getPlatformActivity('facebook');
    expect(activity).toBeInstanceOf(FacebookActivity);
  });

  it('should be case-insensitive', () => {
    const activity = getPlatformActivity('INSTAGRAM');
    expect(activity).toBeInstanceOf(InstagramActivity);
  });

  it('should throw for unsupported platform', () => {
    expect(() => getPlatformActivity('unsupported')).toThrow('Unsupported platform: unsupported');
  });
});
