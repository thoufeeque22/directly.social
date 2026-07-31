/**
 * seed-zap-user.ts
 *
 * Seeds the dedicated ZAP security scan test user (zap@directly.social)
 * into the staging database. Run this once after setting up a new staging
 * environment or resetting the staging database.
 *
 * Usage (on the staging VPS or locally against the staging DB):
 *   DATABASE_URL=<staging_db_url> npx tsx scripts/seed-zap-user.ts
 *
 * The user is created with a `USER` role and no linked social accounts.
 * It exists purely for OWASP ZAP's authenticated scanning — it is not
 * a real user and should never be used for manual testing.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const ZAP_EMAIL = "zap@directly.social";
  const ZAP_NAME = "ZAP Security Scanner";

  console.log("🔐 Seeding ZAP test user...");

  const existingUser = await prisma.user.findUnique({
    where: { email: ZAP_EMAIL },
  });

  if (existingUser) {
    console.log(`✅ ZAP user already exists (id: ${existingUser.id}) — skipping creation.`);
    console.log("   If you need to reset it, delete the user manually and re-run this script.");
    return;
  }

  const user = await prisma.user.create({
    data: {
      email: ZAP_EMAIL,
      name: ZAP_NAME,
      role: "USER",
      // emailVerified is set so NextAuth treats this as a confirmed account
      emailVerified: new Date(),
    },
  });

  console.log(`✅ ZAP user created successfully:`);
  console.log(`   ID:    ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role:  ${user.role}`);
  console.log("");
  console.log("📋 Next steps:");
  console.log("   1. Set ZAP_ENABLED=true in the staging .env file");
  console.log("   2. Generate a strong secret: openssl rand -base64 48");
  console.log("   3. Set ZAP_AUTH_SECRET=<generated_secret> in staging .env");
  console.log("   4. Add the same secret as ZAP_AUTH_SECRET in GitHub Actions secrets");
  console.log("   5. Add STAGING_HTTP_USER and STAGING_HTTP_PASS to GitHub Actions secrets");
}

main()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Seeding failed:", message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
