import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { buildDashboardSeries } from "@/lib/data/metrics";

export const metadata: Metadata = {
  title: "Overview",
  description: "Engagement, reach and audience growth across every connected platform.",
};

export default function DashboardPage() {
  // Built on the server from a fixed seed, so the markup React hydrates against
  // is identical to the first client render.
  return <DashboardOverview initialSeries={buildDashboardSeries()} />;
}
