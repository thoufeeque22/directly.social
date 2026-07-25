import { LinkedInTokenRevokedError } from './types';
import type { LinkedInPostPayload, LinkedInPostResult } from './types';

const UGC_POSTS_URL = 'https://api.linkedin.com/v2/ugcPosts';

interface UgcPostBody {
  author: string;
  lifecycleState: string;
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: { text: string };
      shareMediaCategory: string;
    };
  };
  visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': string };
}

/**
 * (CA-001): LinkedIn UGC post publishing.
 * Uses the UGC Posts API to create a text post on a member profile.
 * 401 responses surface a LinkedInTokenRevokedError for wipe protocol.
 */
export const publishLinkedInPost = async (
  accessToken: string,
  payload: LinkedInPostPayload,
): Promise<LinkedInPostResult> => {
  const body: UgcPostBody = {
    author: payload.authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: payload.text },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  const res = await fetch(UGC_POSTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401) throw new LinkedInTokenRevokedError();

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn post failed (${res.status}): ${text}`);
  }

  const postId = res.headers.get('x-restli-id') ?? '';
  return {
    postId,
    permalink: `https://www.linkedin.com/feed/update/${postId}/`,
  };
};
