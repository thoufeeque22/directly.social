import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { billingRepository } from "@/lib/billing/repository";
import * as Sentry from "@sentry/nextjs";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const billingStatus = await billingRepository.getAll();
    const billingProviders = billingStatus.map(b => ({
      id: b.id,
      provider: b.provider,
      currentSpend: b.currentSpend,
      threshold: b.threshold,
      currency: b.currency,
      status: b.status,
      lastSynced: b.lastSynced
    }));

    return NextResponse.json({ billingProviders });
  } catch (error: unknown) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
