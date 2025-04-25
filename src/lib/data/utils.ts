export interface Stats {
  totalUsers: number;
  activeUsers: number;
  newPosts: number;
  activeNow: number;
}

export interface StatsWithChange extends Stats {
  changes: {
    totalUsers: number;
    activeUsers: number;
    newPosts: number;
    activeNow: number;
  };
}

const STORAGE_KEY = 'dashboard_previous_stats';

export const getPreviousStats = (): Stats | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const savePreviousStats = (stats: Stats) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const generateRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (!previous) return 0;
  return Number(((current - previous) / previous * 100).toFixed(1));
};

export const generateCurrentStats = (): StatsWithChange => {
  const previousStats = getPreviousStats();
  
  const currentStats: Stats = {
    totalUsers: generateRandomValue(5000, 10000),
    activeUsers: generateRandomValue(2500, 5000),
    newPosts: generateRandomValue(100, 500),
    activeNow: generateRandomValue(200, 2000),
  };

  const changes = {
    totalUsers: calculatePercentageChange(currentStats.totalUsers, previousStats?.totalUsers || currentStats.totalUsers),
    activeUsers: calculatePercentageChange(currentStats.activeUsers, previousStats?.activeUsers || currentStats.activeUsers),
    newPosts: calculatePercentageChange(currentStats.newPosts, previousStats?.newPosts || currentStats.newPosts),
    activeNow: calculatePercentageChange(currentStats.activeNow, previousStats?.activeNow || currentStats.activeNow),
  };

  savePreviousStats(currentStats);

  return { ...currentStats, changes };
};
