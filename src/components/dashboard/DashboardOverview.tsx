"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { Charts } from "@/components/dashboard/Charts";
import {
  BASELINE_STATS,
  REFRESH_INTERVAL_MS,
  computeDeltas,
  nextDashboardSeries,
  nextStats,
  type DashboardSeries,
  type StatDeltas,
  type Stats,
} from "@/lib/data/metrics";

const STAT_LABELS: Array<{ key: keyof Stats; label: string }> = [
  { key: "totalUsers", label: "Total Users" },
  { key: "activeUsers", label: "Active Users" },
  { key: "newPosts", label: "New Posts" },
  { key: "activeNow", label: "Active Now" },
];

interface Snapshot {
  stats: Stats;
  /** Null until the first refresh, because there is nothing to compare against. */
  deltas: StatDeltas | null;
}

const INITIAL_SNAPSHOT: Snapshot = { stats: BASELINE_STATS, deltas: null };

interface DashboardOverviewProps {
  initialSeries: DashboardSeries;
}

export function DashboardOverview({ initialSeries }: DashboardOverviewProps) {
  const [snapshot, setSnapshot] = useState<Snapshot>(INITIAL_SNAPSHOT);
  const [series, setSeries] = useState(initialSeries);
  const [status, setStatus] = useState("");

  const refresh = useCallback(() => {
    // Both updaters stay pure so React can safely invoke them twice in
    // development's strict mode.
    setSnapshot((previous) => {
      const stats = nextStats(previous.stats, Math.random);
      return { stats, deltas: computeDeltas(stats, previous.stats) };
    });
    setSeries((previous) => nextDashboardSeries(previous, Math.floor(Math.random() * 2 ** 31)));
    setStatus(`Figures refreshed`);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [refresh]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Synthetic demo figures, refreshed every 60 seconds.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Refresh now
        </Button>
      </div>

      {/* Announces refreshes without stealing focus or covering a card, which
          the old absolutely-positioned banner did. */}
      <p aria-live="polite" className="sr-only">
        {status}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_LABELS.map(({ key, label }) => (
          <StatCard
            key={key}
            label={label}
            value={snapshot.stats[key]}
            delta={snapshot.deltas ? snapshot.deltas[key] : null}
          />
        ))}
      </div>

      <Charts series={series} />
    </div>
  );
}
