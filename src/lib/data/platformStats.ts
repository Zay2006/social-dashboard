import { PLATFORM_IDS, type PlatformId } from "@/lib/platforms";
import { createRandom, hashSeed } from "@/lib/data/random";
import { buildDashboardSeries, type DashboardSeries } from "@/lib/data/metrics";

export interface PlatformStats {
  followers: number;
  posts: number;
  engagementRate: number;
}

export type PlatformBreakdown = Record<PlatformId, PlatformStats>;

/**
 * The sidebar breakdown, derived from the same seeded series that feeds the
 * charts. Previously these were separate hardcoded numbers, so the sidebar and
 * the dashboard contradicted each other.
 */
export function buildPlatformBreakdown(
  series: DashboardSeries = buildDashboardSeries(),
): PlatformBreakdown {
  const random = createRandom(hashSeed("platform-breakdown"));
  const followersByPlatform = new Map(
    series.platformPerformance.map((entry) => [entry.platform, entry.followers]),
  );

  return PLATFORM_IDS.reduce((breakdown, id) => {
    const followers = followersByPlatform.get(id) ?? 0;
    breakdown[id] = {
      followers,
      posts: 4 + Math.floor(random() * 18),
      engagementRate: Number((1.4 + random() * 4.6).toFixed(1)),
    };
    return breakdown;
  }, {} as PlatformBreakdown);
}
