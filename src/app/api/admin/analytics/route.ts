import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/core/prisma";
import * as Sentry from "@sentry/nextjs";

/**
 * API route to fetch aggregated SystemMetric data for the admin dashboard.
 * Protected by ADMIN role check.
 */
export async function GET() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch metrics from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

    const groupedMetrics = await prisma.systemMetric.groupBy({
      by: ["name", "timestamp"],
      _sum: {
        value: true,
      },
      where: {
        timestamp: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    const metrics = groupedMetrics.map((g) => ({
      id: `${g.name}-${g.timestamp.toISOString()}`,
      name: g.name,
      value: g._sum.value || 0,
      timestamp: g.timestamp,
    }));

    return NextResponse.json({ 
      success: true,
      metrics 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[ANALYTICS_FETCH_ERROR]", error);
    Sentry.captureException(error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: errorMessage 
    }, { status: 500 });
  }
}
