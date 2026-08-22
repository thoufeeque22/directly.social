import { inngest } from "../client";
import { prisma } from "@/lib/core/prisma";

export const exportUserData = inngest.createFunction(
  { 
    id: "export-user-data",
    triggers: [{ event: "user.data.export.requested" }]
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async ({ event, step }: { event: { data: { userId: string; email: string } }; step: any }) => {
    const { userId, email } = event.data;

    // Simulate export data creation and sending email for now.
    // In reality, this would fetch data, put in S3, and send email via Resend.
    await step.run("fetch-user-data", async () => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          preference: true,
          postActivities: true,
          metadataTemplates: true,
          platformPreferences: true,
        },
      });
      return user;
    });

    await step.run("send-export-email", async () => {
      // Simulate sending email
      console.log(`Export data ready for ${email}. Email sent.`);
      return { success: true, email };
    });

    return { success: true };
  }
);
