import { describe, expect, it } from "vitest";
import { PLATFORM_IDS } from "@/lib/platforms";
import { createRandom } from "./random";
import {
  BASELINE_STATS,
  STAT_BOUNDS,
  STAT_KEYS,
  buildDashboardSeries,
  computeDeltas,
  followerGrowthCeiling,
  nextDashboardSeries,
  nextStats,
  percentageChange,
} from "./metrics";

describe("buildDashboardSeries", () => {
  it("is deterministic for a given seed", () => {
    // This is what keeps SSR and the first client render in agreement. Seeding
    // component state with Math.random() is a hydration mismatch waiting to
    // happen.
    expect(buildDashboardSeries(42)).toEqual(buildDashboardSeries(42));
  });

  it("produces different series for different seeds", () => {
    expect(buildDashboardSeries(1)).not.toEqual(buildDashboardSeries(2));
  });

  it("covers a full twelve months", () => {
    const series = buildDashboardSeries();
    expect(series.engagement).toHaveLength(12);
    expect(series.followerGrowth).toHaveLength(12);
  });

  it("grows follower counts monotonically", () => {
    const { followerGrowth } = buildDashboardSeries();
    for (const id of PLATFORM_IDS) {
      for (let i = 1; i < followerGrowth.length; i += 1) {
        expect(followerGrowth[i][id]).toBeGreaterThanOrEqual(followerGrowth[i - 1][id]);
      }
    }
  });

  it("derives platform performance from the final month of growth", () => {
    const series = buildDashboardSeries();
    const latest = series.followerGrowth[series.followerGrowth.length - 1];
    for (const entry of series.platformPerformance) {
      expect(entry.followers).toBe(latest[entry.platform]);
    }
  });

  it("keeps reached followers within the addressable total", () => {
    const { audienceReach } = buildDashboardSeries();
    expect(audienceReach.followers).toBeLessThanOrEqual(audienceReach.total);
    expect(audienceReach.total).toBeGreaterThan(0);
  });
});

describe("followerGrowthCeiling", () => {
  it("fits the largest value in the series", () => {
    const series = buildDashboardSeries();
    const ceiling = followerGrowthCeiling(series.followerGrowth);
    for (const point of series.followerGrowth) {
      for (const id of PLATFORM_IDS) {
        // A hardcoded [0, 6000] domain clipped series that reach ~6,700.
        expect(point[id]).toBeLessThanOrEqual(ceiling);
      }
    }
  });
});

describe("nextDashboardSeries", () => {
  it("never reduces a cumulative follower count", () => {
    const previous = buildDashboardSeries();
    const next = nextDashboardSeries(previous, 7);
    next.followerGrowth.forEach((point, index) => {
      for (const id of PLATFORM_IDS) {
        expect(point[id]).toBeGreaterThanOrEqual(previous.followerGrowth[index][id]);
      }
    });
  });
});

describe("nextStats", () => {
  it("keeps every figure inside its bounds over many ticks", () => {
    const random = createRandom(9);
    let stats = BASELINE_STATS;
    for (let i = 0; i < 500; i += 1) {
      stats = nextStats(stats, random);
      for (const key of STAT_KEYS) {
        expect(stats[key]).toBeGreaterThanOrEqual(STAT_BOUNDS[key].min);
        expect(stats[key]).toBeLessThanOrEqual(STAT_BOUNDS[key].max);
      }
    }
  });

  it("moves gradually rather than redrawing at random", () => {
    const random = createRandom(3);
    const next = nextStats(BASELINE_STATS, random);
    const range = STAT_BOUNDS.totalUsers.max - STAT_BOUNDS.totalUsers.min;
    expect(Math.abs(next.totalUsers - BASELINE_STATS.totalUsers)).toBeLessThanOrEqual(range * 0.05);
  });

  it("keeps the audience subsets consistent", () => {
    const random = createRandom(11);
    let stats = BASELINE_STATS;
    for (let i = 0; i < 100; i += 1) {
      stats = nextStats(stats, random);
      expect(stats.activeUsers).toBeLessThanOrEqual(stats.totalUsers);
      expect(stats.activeNow).toBeLessThanOrEqual(stats.activeUsers);
    }
  });
});

describe("percentageChange", () => {
  it("computes a signed percentage to one decimal", () => {
    expect(percentageChange(110, 100)).toBe(10);
    expect(percentageChange(95, 100)).toBe(-5);
    expect(percentageChange(1005, 1000)).toBe(0.5);
  });

  it("returns zero rather than Infinity when there is no baseline", () => {
    expect(percentageChange(100, 0)).toBe(0);
  });
});

describe("computeDeltas", () => {
  it("reports no movement when nothing changed", () => {
    expect(computeDeltas(BASELINE_STATS, BASELINE_STATS)).toEqual({
      totalUsers: 0,
      activeUsers: 0,
      newPosts: 0,
      activeNow: 0,
    });
  });
});
