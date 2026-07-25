"use client";

import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { LineChart } from "@mui/x-charts";

interface Metric {
  name: string;
  value: number;
  timestamp: string;
}

interface FeatureAdoptionChartProps {
  metrics: Metric[];
  featureNames: string[];
  featureLabels: Record<string, string>;
}

export function FeatureAdoptionChart({ metrics, featureNames, featureLabels }: FeatureAdoptionChartProps) {
  const dates = Array.from(new Set(metrics.map(m => m.timestamp.split('T')[0]))).sort();

  const featureSeries = featureNames.map(name => ({
    label: featureLabels[name] || name,
    data: dates.map(date => {
      const metric = metrics.find(m => m.name === name && m.timestamp.split('T')[0] === date);
      return metric ? metric.value : 0;
    }),
  }));

  return (
    <Paper elevation={3} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
      <Box sx={{ p: 3 }} data-testid="feature-adoption-chart">
        <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
          Feature Adoption Trends
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Daily usage metrics for core application features.
        </Typography>
        {dates.length > 0 ? (
          <Box sx={{ height: 400 }}>
            <LineChart
              xAxis={[{ 
                scaleType: 'point', 
                data: dates,
                valueFormatter: (value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
              }]}
              series={featureSeries.map(s => ({
                data: s.data,
                label: s.label,
                showMark: true,
                curve: "linear" as const,
              }))}
              height={350}
              margin={{ top: 20, right: 30, bottom: 50, left: 50 }}
            />
          </Box>
        ) : (
          <Box sx={{ height: 400, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Typography color="text.secondary">No historical data available yet</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
