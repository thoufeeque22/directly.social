"use client";

import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { SYSTEM_METRICS } from "@/lib/core/metrics";

interface Metric {
  name: string;
  value: number;
}

interface PlatformHealthChartProps {
  metrics: Metric[];
}

export function PlatformHealthChart({ metrics }: PlatformHealthChartProps) {
  const theme = useTheme();
  const platformNames = ["youtube", "instagram", "tiktok"];
  
  const platformHealthData = platformNames.map(platform => {
    const success = metrics
      .filter(m => m.name === SYSTEM_METRICS.PLATFORM.SUCCESS(platform))
      .reduce((sum, m) => sum + m.value, 0);
    const errorCount = metrics
      .filter(m => m.name === SYSTEM_METRICS.PLATFORM.ERROR(platform))
      .reduce((sum, m) => sum + m.value, 0);
    return { platform: platform.charAt(0).toUpperCase() + platform.slice(1), success, error: errorCount };
  });

  return (
    <Paper elevation={3} sx={{ bgcolor: 'background.paper', borderRadius: 2 }} data-testid="platform-health-chart">
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
          Platform Distribution Health
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Success vs. failure rates across social platforms.
        </Typography>
        <Box sx={{ height: 400 }}>
          <BarChart
            xAxis={[{ 
              scaleType: 'band', 
              data: platformHealthData.map(d => d.platform) 
            }]}
            series={[
              { data: platformHealthData.map(d => d.success), label: 'Success', color: theme.palette.success.main },
              { data: platformHealthData.map(d => d.error), label: 'Error', color: theme.palette.error.main },
            ]}
            height={350}
            margin={{ top: 20, right: 10, bottom: 50, left: 50 }}
          />
        </Box>
      </Box>
    </Paper>
  );
}
