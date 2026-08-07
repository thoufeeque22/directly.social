import { PlatformData } from "./distributor-utils";

/**
 * Generates a direct permalink to the published content on each platform.
 */
export function generatePermalink(platform: string, data: PlatformData): string | null {
  if (!data) return null;
  
  // Use official platform permalink if provided (Gold Standard)
  if (data.permalink) {
    let link = data.permalink;
    // Force modern vertical video format if Meta returns the legacy URL
    if (platform === 'facebook' && link.includes('facebook.com/watch/?v=')) {
      link = link.replace('facebook.com/watch/?v=', 'facebook.com/reel/');
    }
    if (platform === 'instagram' && link.includes('instagram.com/reels/')) {
      link = link.replace('instagram.com/reels/', 'instagram.com/reel/');
    }
    return link;
  }

  switch (platform) {
    case 'youtube': {
      const videoId = data.id || data.videoId;
      return videoId ? `https://youtube.com/watch?v=${videoId}` : null;
    }
    case 'facebook': {
      const videoId = data.videoId || data.id;
      // Use the modern Reels format for Facebook vertical videos
      return videoId ? `https://www.facebook.com/reel/${videoId}` : null;
    }
    case 'instagram': {
      const mediaId = data.id || data.videoId;
      // Instagram Reels specific link pattern (singular reel/ is more modern)
      return mediaId ? `https://www.instagram.com/reel/${mediaId}/` : null;
    }
    case 'tiktok': {
      const publishId = data.publish_id || data.id;
      // TikTok doesn't easily give a direct video URL from publish_id, 
      // but we can link to the user's profile or a generic search
      return publishId ? `https://www.tiktok.com/` : null;
    }
    case 'linkedin': {
      const publishId = data.id || data.publish_id;
      if (!publishId) return null;
      
      // Text posts return a share URN which is cleanly routable
      if (publishId.includes('urn:li:share:')) {
        return `https://www.linkedin.com/feed/update/${publishId}/`;
      }
      
      // Video posts still return a ugcPost URN which LinkedIn's frontend actively blocks 
      // from direct routing (404s). Since we cannot derive the wrapper Activity ID mathematically,
      // the safest UX fallback is to direct them to the LinkedIn homepage where they can navigate to their profile.
      return `https://www.linkedin.com/`;
    }
    default:
      return null;
  }
}
