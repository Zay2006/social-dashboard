"use client";

import { useEffect, useState } from 'react';
import { RevenueChart, UserActivityChart } from './Charts';
import { generateMonthlyData, generateUserActivity, generateCurrentStats } from '@/lib/data/utils';

// Initial static data to prevent hydration mismatch
const initialMonthlyData = [
  { name: 'Jan', revenue: 3000, users: 2500, activeUsers: 1500, newPosts: 100, activeNow: 500 },
  { name: 'Feb', revenue: 3500, users: 2700, activeUsers: 1600, newPosts: 120, activeNow: 550 },
  { name: 'Mar', revenue: 4000, users: 2900, activeUsers: 1700, newPosts: 130, activeNow: 600 },
  { name: 'Apr', revenue: 4200, users: 3100, activeUsers: 1800, newPosts: 140, activeNow: 650 },
  { name: 'May', revenue: 4500, users: 3300, activeUsers: 1900, newPosts: 150, activeNow: 700 },
  { name: 'Jun', revenue: 4800, users: 3500, activeUsers: 2000, newPosts: 160, activeNow: 750 },
  { name: 'Jul', revenue: 5000, users: 3700, activeUsers: 2100, newPosts: 170, activeNow: 800 },
  { name: 'Aug', revenue: 5200, users: 3900, activeUsers: 2200, newPosts: 180, activeNow: 850 },
  { name: 'Sep', revenue: 5400, users: 4100, activeUsers: 2300, newPosts: 190, activeNow: 900 },
  { name: 'Oct', revenue: 5600, users: 4300, activeUsers: 2400, newPosts: 200, activeNow: 950 },
  { name: 'Nov', revenue: 5800, users: 4500, activeUsers: 2500, newPosts: 210, activeNow: 1000 },
  { name: 'Dec', revenue: 6000, users: 4700, activeUsers: 2600, newPosts: 220, activeNow: 1050 },
];

const initialUserActivity = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  users: 200 + Math.floor(i * 10),
}));

const initialStats = {
  totalUsers: 10000,
  activeUsers: 5000,
  newPosts: 250,
  activeNow: 1000,
  revenue: 3000,
};

export function DashboardClient() {
  const [monthlyData, setMonthlyData] = useState(initialMonthlyData);
  const [userActivity, setUserActivity] = useState(initialUserActivity);
  const [currentStats, setCurrentStats] = useState(initialStats);
  const [isClient, setIsClient] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update data every 15 minutes (average of 10-30 minutes)
  useEffect(() => {
    if (!isClient) return;

    // Initial update
    const updateData = async () => {
      setIsUpdating(true);
      try {
        setMonthlyData(generateMonthlyData());
        setUserActivity(generateUserActivity());
        setCurrentStats(generateCurrentStats());
      } finally {
        setIsUpdating(false);
      }
    };

    updateData();

    const interval = setInterval(updateData, 15 * 60 * 1000); // 15 minutes in milliseconds

    return () => clearInterval(interval);
  }, [isClient]);

  return (
    <div className="space-y-8 relative">
      {isUpdating && (
        <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm">
          Updating data...
        </div>
      )}
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Total Users</h3>
          <p className="mt-2 text-3xl font-bold">{currentStats.totalUsers.toLocaleString()}</p>
          <p className="text-sm text-green-600">+2.5% from last month</p>
        </div>
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Active Users</h3>
          <p className="mt-2 text-3xl font-bold">{currentStats.activeUsers.toLocaleString()}</p>
          <p className="text-sm text-green-600">+3.2% from last month</p>
        </div>
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">New Posts</h3>
          <p className="mt-2 text-3xl font-bold">{currentStats.newPosts.toLocaleString()}</p>
          <p className="text-sm text-green-600">+1.8% from last month</p>
        </div>
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Active Now</h3>
          <p className="mt-2 text-3xl font-bold">{currentStats.activeNow.toLocaleString()}</p>
          <p className="text-sm text-green-600">+4.1% from last hour</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-lg border p-6 shadow-sm">
        <h3 className="text-lg font-medium mb-4">Monthly Revenue</h3>
        <RevenueChart data={monthlyData} />
      </div>

      {/* User Activity Chart */}
      <div className="rounded-lg border p-6 shadow-sm">
        <h3 className="text-lg font-medium mb-4">User Activity (24h)</h3>
        <UserActivityChart data={userActivity} />
      </div>
    </div>
  );
}
