import { NextRequest } from "next/server";
import { handlePlatformUploadRequest, UploadLogicParams } from "@/lib/core/platform-route-handler";

export const maxDuration = 300; 

/**
 * LOCAL SIMULATOR UPLOAD HANDLER
 * Uses the unified route handler to simulate an upload for local testing.
 */
export async function POST(req: NextRequest) {
  return handlePlatformUploadRequest({
    req,
    platform: "local",
    uploadLogic: async ({ fields, onProgress }: UploadLogicParams) => {
      const p = fields.actualPlatform || 'local1';
      
      console.log(`🚀 [LOCAL-SIM-API] Starting simulated upload for ${p}...`);
      for (let i = 1; i <= 5; i++) {
        await new Promise(r => setTimeout(r, 800));
        if (onProgress) onProgress(i * 20);
      }
      
      console.log(`✅ [LOCAL-SIM-API] Simulated publish complete for ${p}!`);
      
      return {
        id: `sim-${p}-${Date.now()}`,
        permalink: `http://localhost:3000/simulator/${p}/${Date.now()}`
      };
    }
  });
}
