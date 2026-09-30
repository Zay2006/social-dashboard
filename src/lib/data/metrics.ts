import { PLATFORM_IDS, type PlatformId } from "@/lib/platforms";
import { clamp, createRandom, hashSeed, walk } from "@/lib/data/random";

/** How often the dashboard refreshes its figures. */
export const REFRESH_INTERVAL_MS = 60_000;

/** Fixed seed so the first render is identical on the server and the client. */
const BASE_SEED = hashSeed("social-dashboard");

export interface Stats {
  totalUsers: number;
  activeUsers: number;
  newPosts: number;
  activeNow: number;
}

export type StatKey = keyof Stats;

export type StatDeltas = Record<StatKey, number>;

export const STAT_BOUNDS: Record<StatKey, { min: number; max: number }> = {
  totalUsers: { min: 5_000, max: 10_000 },
  activeUsers: { min: 2_500, max: 5_000 },
  newPosts: { min: 100, max: 500 },
  activeNow: { min: 200, max: 2_000 },
};

export const STAT_KEYS = Object.keys(STAT_BOUNDS) as StatKey[];

/**
 * The figures rendered during SSR and on the first client pass. Constant by
 * design — anything random here would differ between the two renders.
 */
export const BASELINE_STATS: Stats = {
  totalUsers: 7_480,
  activeUsers: 3_620,
  newPosts: 284,
  activeNow: 912,
};

/** Percentage change, rounded to one decimal. Returns 0 when there is no base. */
export function percentageChange(current: number, previous: number): number {
  if (!previous) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function computeDeltas(current: Stats, previous: Stats): StatDeltas {
  return {
    totalUsers: percentageChange(current.totalUsers, previous.totalUsers),
    activeUsers: percentageChange(current.activeUsers, previous.activeUsers),
    newPosts: percentageChange(current.newPosts, previous.newPosts),
    activeNow: percentageChange(current.activeNow, previous.activeNow),
  };
}

/**
 * Nudges each figure within its bounds, so "% from last update" describes a real
 * movement rather than the distance between two unrelated random draws.
 */
export function nextStats(previous: Stats, random: () => number): Stats {
  const next = {} as Stats;
  for (const key of STAT_KEYS) {
    const { min, max } = STAT_BOUNDS[key];
    next[key] = walk(random, previous[key], min, max);
  }
  // Active users are a subset of the audience, and "active now" a subset of those.
  next.activeUsers = Math.min(next.activeUsers, next.totalUsers);
  next.activeNow = Math.min(next.activeNow, next.activeUsers);
  return next;
}

export interface EngagementPoint {
  month: string;
  total: number;
}

export type FollowerGrowthPoint = { month: string } & Record<PlatformId, number>;

export interface PlatformPerformancePoint {
  platform: PlatformId;
  label: string;
  followers: number;
}

export interface AudienceReach {
  followers: number;
  total: number;
}

export interface DashboardSeries {
  engagement: EngagementPoint[];
  followerGrowth: FollowerGrowthPoint[];
  platformPerformance: PlatformPerformancePoint[];
  audienceReach: AudienceReach;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Starting follower count and monthly growth ceiling, per platform. */
const GROWTH_PROFILE: Record<PlatformId, { start: number; monthlyMax: number }> = {
  twitter: { start: 1_800, monthlyMax: 260 },
  instagram: { start: 2_400, monthlyMax: 340 },
  linkedin: { start: 1_200, monthlyMax: 180 },
  youtube: { start: 900, monthlyMax: 220 },
  tiktok: { start: 2_100, monthlyMax: 420 },
  pinterest: { start: 700, monthlyMax: 140 },
};

function buildEngagement(random: () => number): EngagementPoint[] {
  let total = 2_600;
  return MONTHS.map((month) => {
    total = walk(random, total, 1_800, 5_200, 0.12);
    return { month, total };
  });
}

/**
 * Cumulative, so the "Follower Growth" chart actually shows growth. The previous
 * version drew an independent random value per month, which is not a trend.
 */
function buildFollowerGrowth(random: () => number): FollowerGrowthPoint[] {
  const running = { ...Object.fromEntries(PLATFORM_IDS.map((id) => [id, 0])) } as Record<
    PlatformId,
    number
  >;
  for (const id of PLATFORM_IDS) running[id] = GROWTH_PROFILE[id].start;

  return MONTHS.map((month) => {
    const point = { month } as FollowerGrowthPoint;
    for (const id of PLATFORM_IDS) {
      // Mostly upward with the occasional flat month.
      const gain = Math.round(random() * GROWTH_PROFILE[id].monthlyMax * 1.15 - 20);
      running[id] = Math.max(running[id], running[id] + gain);
      point[id] = running[id];
    }
    return point;
  });
}

export function buildDashboardSeries(seed: number = BASE_SEED): DashboardSeries {
  const random = createRandom(seed);
  const engagement = buildEngagement(random);
  const followerGrowth = buildFollowerGrowth(random);

  // Derived from the final month of the growth series so the two charts agree
  // instead of telling contradictory stories.
  const latest = followerGrowth[followerGrowth.length - 1];
  const platformPerformance: PlatformPerformancePoint[] = PLATFORM_IDS.map((id) => ({
    platform: id,
    label: id,
    followers: latest[id],
  }));

  const followers = platformPerformance.reduce((sum, entry) => sum + entry.followers, 0);
  // A reach percentage is only meaningful if followers are a subset of a total.
  const total = Math.round(followers / clamp(0.24 + random() * 0.26, 0.05, 0.95));

  return {
    engagement,
    followerGrowth,
    platformPerformance,
    audienceReach: { followers, total },
  };
}

/** Advances the whole series by one refresh tick. */
export function nextDashboardSeries(previous: DashboardSeries, seed: number): DashboardSeries {
  const random = createRandom(seed);

  const engagement = previous.engagement.map((point) => ({
    ...point,
    total: walk(random, point.total, 1_800, 5_200, 0.06),
  }));

  // Growth only ever moves forward, and only the most recent months move much.
  const followerGrowth = previous.followerGrowth.map((point, index) => {
    const next = { ...point };
    const recency = (index + 1) / previous.followerGrowth.length;
    for (const id of PLATFORM_IDS) {
      next[id] = point[id] + Math.round(random() * GROWTH_PROFILE[id].monthlyMax * 0.1 * recency);
    }
    return next;
  });

  const latest = followerGrowth[followerGrowth.length - 1];
  const platformPerformance = previous.platformPerformance.map((entry) => ({
    ...entry,
    followers: latest[entry.platform],
  }));

  const followers = platformPerformance.reduce((sum, entry) => sum + entry.followers, 0);
  const total = Math.max(previous.audienceReach.total, followers);

  return { engagement, followerGrowth, platformPerformance, audienceReach: { followers, total } };
}

/** Largest value the follower-growth chart has to fit, rounded up to a tick. */
export function followerGrowthCeiling(points: FollowerGrowthPoint[]): number {
  let max = 0;
  for (const point of points) {
    for (const id of PLATFORM_IDS) max = Math.max(max, point[id]);
  }
  return Math.ceil(max / 500) * 500;
}
