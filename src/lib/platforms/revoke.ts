import { logger } from "@/lib/core/logger";

export class PlatformRevocationUtility {
  /**
   * Revokes Google OAuth token.
   * Documentation: https://developers.google.com/identity/protocols/oauth2/web-server#tokenrequest-revocation
   */
  async revokeGoogle(token: string): Promise<boolean> {
    try {
      const response = await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return response.ok;
    } catch (error) {
      logger.error(`[REVOKE_GOOGLE] Failed to revoke Google token: ${error}`);
      return false;
    }
  }

  /**
   * Revokes TikTok OAuth token.
   * Documentation: https://developers.tiktok.com/doc/login-kit-manage-user-access-tokens/
   */
  async revokeTikTok(token: string): Promise<boolean> {
    try {
      const response = await fetch("https://open-api.tiktok.com/v2/auth/revoke/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token }),
      });
      return response.ok;
    } catch (error) {
      logger.error(`[REVOKE_TIKTOK] Failed to revoke TikTok token: ${error}`);
      return false;
    }
  }

  /**
   * Revokes Facebook/Meta permissions.
   * Documentation: https://developers.facebook.com/docs/graph-api/reference/v12.0/user/permissions/
   */
  async revokeFacebook(token: string): Promise<boolean> {
    try {
      const response = await fetch(`https://graph.facebook.com/v12.0/me/permissions?access_token=${token}`, {
        method: "DELETE",
      });
      return response.ok;
    } catch (error) {
      logger.error(`[REVOKE_FACEBOOK] Failed to revoke Facebook permissions: ${error}`);
      return false;
    }
  }
}
