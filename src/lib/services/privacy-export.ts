import { prisma } from "@/lib/core/prisma";

export class PrivacyExportHelper {
  /**
   * Aggregates all user-related data for export.
   */
  static async getExportData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
        galleryAssets: true,
        postActivities: true,
        metadataTemplates: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      accounts: user.accounts.map((acc) => ({
        provider: acc.provider,
        type: acc.type,
        providerAccountId: acc.providerAccountId,
      })),
      galleryAssets: user.galleryAssets.map((asset) => ({
        id: asset.id,
        fileName: asset.fileName,
        mimeType: asset.mimeType,
        fileSize: asset.fileSize?.toString(),
        createdAt: asset.createdAt,
      })),
      activities: user.postActivities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        scheduledAt: activity.scheduledAt,
        isPublished: activity.isPublished,
        createdAt: activity.createdAt,
      })),
      metadataTemplates: user.metadataTemplates.map((tpl) => ({
        id: tpl.id,
        name: tpl.name,
        content: tpl.content,
      })),
    };
  }
}
