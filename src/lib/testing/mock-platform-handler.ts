import { NextResponse } from "next/server";
import { prisma } from "@/lib/core/prisma";

export async function handleMockPlatformUpload(
  activityId: string | undefined,
  platform: string,
  accountId: string
) {
  // Simulate a real upload delay so the user can see the progress bar in E2E tests
  await new Promise(resolve => setTimeout(resolve, 1500));
  const mockResult = { id: `mock-post-${Date.now()}`, videoId: `mock-vid-${Date.now()}` };
  
  if (activityId) {
    const { extractPlatformPostId, generatePermalink } = await import("@/lib/core/distributor-utils");
    await prisma.postPlatformResult.update({ 
      where: { postActivityId_platform_accountId: { postActivityId: activityId, platform, accountId } }, 
      data: { 
        status: 'success', 
        platformPostId: extractPlatformPostId(platform, mockResult), 
        permalink: generatePermalink(platform, mockResult), 
        progress: 100 
      } 
    });
  }
  
  return NextResponse.json({ success: true, data: mockResult });
}
