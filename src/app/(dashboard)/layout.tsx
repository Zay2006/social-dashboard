import { DashboardShell } from "@/components/layout/DashboardShell";
import { buildPlatformBreakdown } from "@/lib/data/platformStats";

/**
 * Nested layout for every dashboard route. Because this is a real Next.js
 * layout, the sidebar is not remounted on navigation and pages no longer have to
 * wrap themselves in it.
 */
export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const breakdown = buildPlatformBreakdown();
  return <DashboardShell breakdown={breakdown}>{children}</DashboardShell>;
}
