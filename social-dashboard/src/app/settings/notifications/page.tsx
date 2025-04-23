"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Bell, Twitter, Instagram, Linkedin, MessageCircle, Heart, Share2, UserPlus } from 'lucide-react';

const notifications = [
  {
    id: 1,
    platform: 'twitter',
    type: 'like',
    content: 'Sarah Johnson liked your tweet about LaunchPad Philly',
    time: '2025-04-23T14:30:00Z',
    read: false
  },
  {
    id: 2,
    platform: 'instagram',
    type: 'comment',
    content: 'Mike Smith commented on your post: "Great insights on tech trends!"',
    time: '2025-04-23T13:45:00Z',
    read: false
  },
  {
    id: 3,
    platform: 'linkedin',
    type: 'share',
    content: 'Tech Weekly shared your article about web development',
    time: '2025-04-23T12:15:00Z',
    read: true
  },
  {
    id: 4,
    platform: 'twitter',
    type: 'follow',
    content: 'TechHub started following you',
    time: '2025-04-23T11:30:00Z',
    read: true
  }
];

export default function NotificationSettingsPage() {
  const getIcon = (platform: string, type: string) => {
    const iconClass = 'w-5 h-5';
    
    if (type === 'like') return <Heart className={iconClass + ' text-red-500'} />;
    if (type === 'comment') return <MessageCircle className={iconClass + ' text-blue-500'} />;
    if (type === 'share') return <Share2 className={iconClass + ' text-green-500'} />;
    if (type === 'follow') return <UserPlus className={iconClass + ' text-purple-500'} />;

    switch (platform) {
      case 'twitter':
        return <Twitter className={iconClass + ' text-blue-400'} />;
      case 'instagram':
        return <Instagram className={iconClass + ' text-pink-500'} />;
      case 'linkedin':
        return <Linkedin className={iconClass + ' text-blue-600'} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notification Settings</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {notifications.filter(n => !n.read).length} unread
          </span>
          <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
            Mark all as read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-lg border p-4 transition-colors ${notification.read ? 'bg-white dark:bg-gray-900' : 'bg-blue-50 dark:bg-gray-800'}`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">
                {getIcon(notification.platform, notification.type)}
              </div>
              <div className="flex-1">
                <p className={`${notification.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                  {notification.content}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTime(notification.time)}
                </span>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
