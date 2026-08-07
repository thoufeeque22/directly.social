/**
 * Standardizes caption formatting across platforms.
 * Ensures consistent application of hashtags and line breaks.
 */
export function formatPlatformCaption({
  title,
  description,
  hashtags = [],
  platform
}: {
  title: string;
  description: string;
  hashtags?: string[];
  platform: string;
}): string {
  // YouTube uses snippet.title and snippet.description separately, but we might want to join them
  if (platform === 'youtube') {
    return description; // YouTube has dedicated title field
  }

  // Instagram/Facebook usually join everything into the caption/description
  const hashtagString = hashtags.length > 0 ? `\n\n${hashtags.join(" ")}` : "";
  
  if (title === description || !description) {
    const base = `${title}${hashtagString}`;
    if (platform === 'tiktok' && base.length > 150) {
      return base.substring(0, 147) + "...";
    }
    return base;
  }

  const full = `${title}\n\n${description}${hashtagString}`;
  if (platform === 'tiktok' && full.length > 150) {
    return full.substring(0, 147) + "...";
  }
  return full;
}
