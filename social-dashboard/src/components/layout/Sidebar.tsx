"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ChevronDown,
  Twitter,
  Instagram,
  Linkedin,
  Bell,
  Palette,
  UserCircle
} from 'lucide-react';
import { useState } from 'react';

interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  newPosts: number;
  activeNow: number;
}

const platformStats: Record<string, PlatformStats> = {
  twitter: {
    totalUsers: 1532,
    activeUsers: 894,
    newPosts: 43,
    activeNow: 126
  },
  instagram: {
    totalUsers: 1284,
    activeUsers: 723,
    newPosts: 31,
    activeNow: 89
  },
  linkedin: {
    totalUsers: 987,
    activeUsers: 453,
    newPosts: 15,
    activeNow: 47
  },
  tiktok: {
    totalUsers: 2156,
    activeUsers: 1245,
    newPosts: 98,
    activeNow: 234
  },
  youtube: {
    totalUsers: 843,
    activeUsers: 321,
    newPosts: 12,
    activeNow: 67
  },
  pinterest: {
    totalUsers: 654,
    activeUsers: 234,
    newPosts: 21,
    activeNow: 45
  }
};

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  
  const isActive = (path: string) => pathname === path;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-5 h-5 text-blue-400" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="w-64 border-r min-h-screen p-4 space-y-4 bg-white dark:bg-gray-900 dark:border-gray-800">
      <nav className="space-y-2">
        <Link
          href="/"
          className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/') ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        {/* Platform Sections */}
        {Object.entries(platformStats).map(([platform, stats]) => (
          <div key={platform} className="space-y-1">
            <button
              onClick={() => setExpandedPlatform(expandedPlatform === platform ? null : platform)}
              className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive(`/${platform}`) ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`}
            >
              <div className="flex items-center gap-2">
                {getPlatformIcon(platform)}
                <span className="capitalize">{platform}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${expandedPlatform === platform ? 'transform rotate-180' : ''}`}
              />
            </button>
            {expandedPlatform === platform && (
              <div className="ml-4 space-y-2 py-2">
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Total Users:</span>
                    <span className="font-medium">{formatNumber(stats.totalUsers)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-medium">{formatNumber(stats.activeUsers)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Posts:</span>
                    <span className="font-medium">{formatNumber(stats.newPosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Now:</span>
                    <span className="font-medium">{formatNumber(stats.activeNow)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <Link
          href="/users"
          className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/users') ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`}
        >
          <Users className="w-5 h-5" />
          <span>Users</span>
        </Link>
        <Link
          href="/posts"
          className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/posts') ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`}
        >
          <FileText className="w-5 h-5" />
          <span>Posts</span>
        </Link>

        <div className="pt-4">
          <div className="text-sm font-medium text-gray-400 dark:text-gray-500 px-2">Settings</div>
          <div className="mt-2 space-y-1">
            <Link
              href="/settings/account"
              className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/settings/account') ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`}
            >
              <UserCircle className="w-5 h-5" />
              <span>Account</span>
            </Link>
            <Link
              href="/settings/notifications"
              className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/settings/notifications') ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </Link>
            <Link
              href="/settings/appearance"
              className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/settings/appearance') ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`}
            >
              <Palette className="w-5 h-5" />
              <span>Appearance</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
