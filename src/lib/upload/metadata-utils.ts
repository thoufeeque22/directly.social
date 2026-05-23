export function sanitizeMetadata(platform: string, title: string, desc: string) {
  let finalTitle = title || '';
  let finalDesc = desc || '';

  if (platform === 'youtube') finalTitle = finalTitle.slice(0, 100);
  else if (platform === 'tiktok') finalTitle = finalTitle.slice(0, 150);
  else if (platform === 'instagram') finalDesc = finalDesc.slice(0, 2200);

  return { title: finalTitle, description: finalDesc };
}
