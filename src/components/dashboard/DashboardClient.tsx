"use client";

import { useEffect, useState } from 'react';
import Charts from './Charts';
import { generateCurrentStats } from '@/lib/data/utils';

// Initial static data to prevent hydration mismatch
const initialStats = {
  totalUsers: 5000,
  activeUsers: 2500,
  newPosts: 250,
  activeNow: 1000,
  changes: {
    totalUsers: 0,
    activeUsers: 0,
    newPosts: 0,
    activeNow: 0,
  }
};

export function DashboardClient() {
  const [currentStats, setCurrentStats] = useState(initialStats);
  const [isClient, setIsClient] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update data on mount and every minute
  useEffect(() => {
    if (!isClient) return;

    // Initial update
    const updateData = async () => {
      setIsUpdating(true);
      try {
        setCurrentStats(generateCurrentStats());
      } finally {
        setTimeout(() => setIsUpdating(false), 500); // Show updating indicator for at least 500ms
      }
    };

    // Update immediately on mount
    updateData();

    // Then update every minute
    const interval = setInterval(updateData, 60 * 1000);

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
          <p className={`text-sm ${currentStats.changes.totalUsers >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {currentStats.changes.totalUsers > 0 ? '+' : ''}{currentStats.changes.totalUsers}% from last update
          </p>
        </div>
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Active Users</h3>
          <p className="mt-2 text-3xl font-bold">{currentStats.activeUsers.toLocaleString()}</p>
          <p className={`text-sm ${currentStats.changes.activeUsers >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {currentStats.changes.activeUsers > 0 ? '+' : ''}{currentStats.changes.activeUsers}% from last update
          </p>
        </div>
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">New Posts</h3>
          <p className="mt-2 text-3xl font-bold">{currentStats.newPosts.toLocaleString()}</p>
          <p className={`text-sm ${currentStats.changes.newPosts >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {currentStats.changes.newPosts > 0 ? '+' : ''}{currentStats.changes.newPosts}% from last update
          </p>
        </div>
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Active Now</h3>
          <p className="mt-2 text-3xl font-bold">{currentStats.activeNow.toLocaleString()}</p>
          <p className={`text-sm ${currentStats.changes.activeNow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {currentStats.changes.activeNow > 0 ? '+' : ''}{currentStats.changes.activeNow}% from last update
          </p>
        </div>
      </div>

      {/* Charts */}
      <Charts />
    </div>
  );
}
