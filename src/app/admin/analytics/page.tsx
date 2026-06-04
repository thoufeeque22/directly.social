import React from "react";
import { Metadata } from "next";
import { AnalyticsContent } from "./AnalyticsContent";

export const metadata: Metadata = {
  title: "Admin Analytics | Directly",
};

export default function AnalyticsPage() {
  return <AnalyticsContent />;
}
