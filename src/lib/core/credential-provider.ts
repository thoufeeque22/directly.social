import { prisma } from "@/lib/core/prisma";

export async function getPlatformCredentials(userId: string, platform: string) {
  const byok = await prisma.byokCredential.findUnique({
    where: {
      userId_platform: {
        userId,
        platform: platform.toUpperCase(),
      },
    },
  });

  if (byok) {
    return {
      clientId: byok.clientId,
      clientSecret: byok.clientSecret, // Ensure this is decrypted if using encryption utility
      redirectUri: byok.redirectUri,
    };
  }

  // Fallback to environment variables
  return {
    clientId: process.env[`${platform.toUpperCase()}_CLIENT_ID`] || process.env[`AUTH_${platform.toUpperCase()}_ID`],
    clientSecret: process.env[`${platform.toUpperCase()}_CLIENT_SECRET`] || process.env[`AUTH_${platform.toUpperCase()}_SECRET`],
    redirectUri: process.env[`${platform.toUpperCase()}_REDIRECT_URI`],
  };
}
