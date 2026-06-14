import { 
  PlatformActivity, 
  VerificationParams, 
  InitiationParams, 
  PushParams, 
  PollingParams, 
  FinalizationParams 
} from "./types";
import { getYouTubeClient } from "./youtube/account";
import { initYouTubeSession } from "./youtube/session";
import { pushYouTubeBinary } from "./youtube/push";
import { promises as fs } from "fs";

/**
 * (OO-003): YouTube implementation of PlatformActivity.
 * (CA-003): Uses specialized YouTube functions for stage execution.
 */
export class YouTubeActivity implements PlatformActivity {
  async preVerify(params: VerificationParams): Promise<void> {
    await getYouTubeClient(params.userId, params.accountId);
  }

  async init(params: InitiationParams): Promise<{ creationId: string; resumableUrl: string }> {
    const youtube = await getYouTubeClient(params.userId, params.accountId);
    const { size: fileSize } = await fs.stat(params.filePath);
    
    const resumableUrl = await initYouTubeSession(youtube, fileSize, {
      snippet: { 
        title: params.title, 
        description: params.description, 
        tags: ["Directly"], 
        categoryId: "22" 
      },
      status: { 
        privacyStatus: "private", // Default to private for safety
        selfDeclaredMadeForKids: false 
      },
    });

    return { creationId: resumableUrl, resumableUrl };
  }

  async push(params: PushParams): Promise<{ resumableUrl: string; platformPostId: string }> {
    const { size: fileSize } = await fs.stat(params.filePath);
    
    // Resume logic
    const offsetRes = await fetch(params.creationId, {
      method: "PUT",
      headers: { "Content-Range": `bytes */${fileSize}` },
    });

    let startByte = 0;
    if (offsetRes.status === 308) {
      const range = offsetRes.headers.get("Range");
      if (range) {
        startByte = parseInt(range.split("-")[1]) + 1;
      }
    }

    const result = await pushYouTubeBinary(
      params.creationId, 
      params.filePath, 
      startByte, 
      fileSize, 
      params.onProgress
    );

    return { 
      resumableUrl: params.creationId,
      platformPostId: result.id 
    };
  }

  async poll(params: PollingParams): Promise<void> {
    // YouTube v3 API doesn't have a direct "poll" for upload completion in the same way Meta does,
    // as the push call is blocking until the upload is processed into a video object.
    await getYouTubeClient(params.userId, params.accountId);
  }

  async finalize(params: FinalizationParams): Promise<{ id: string; permalink: string }> {
    // For YouTube, the "push" actually completes the publish if it's not a draft.
    // We return a placeholder permalink if we don't have the final one yet.
    return { 
      id: "pending", 
      permalink: "" 
    };
  }
}
