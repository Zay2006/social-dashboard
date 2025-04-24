import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockUsers } from '@/lib/data/mockData';
import { Twitter, Instagram, Linkedin, Youtube, Music2, Share2 } from 'lucide-react';

export default function UsersPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockUsers.map((user) => (
          <div key={user.id} className="rounded-lg border p-6 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="font-semibold text-lg">{user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
              </div>
            </div>
            <p className="text-sm">{user.bio}</p>
            <div className="flex flex-wrap gap-2">
              {user.platforms.twitter && (
                <div className="flex items-center gap-1 text-sm text-blue-400">
                  <Twitter className="w-4 h-4" />
                  <span>{user.platforms.twitter}</span>
                </div>
              )}
              {user.platforms.instagram && (
                <div className="flex items-center gap-1 text-sm text-pink-500">
                  <Instagram className="w-4 h-4" />
                  <span>{user.platforms.instagram}</span>
                </div>
              )}
              {user.platforms.linkedin && (
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <Linkedin className="w-4 h-4" />
                  <span>{user.platforms.linkedin}</span>
                </div>
              )}
              {user.platforms.youtube && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <Youtube className="w-4 h-4" />
                  <span>{user.platforms.youtube}</span>
                </div>
              )}
              {user.platforms.tiktok && (
                <div className="flex items-center gap-1 text-sm text-gray-800 dark:text-gray-200">
                  <Music2 className="w-4 h-4" />
                  <span>{user.platforms.tiktok}</span>
                </div>
              )}
              {user.platforms.pinterest && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <Share2 className="w-4 h-4" />
                  <span>{user.platforms.pinterest}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{user.followers.toLocaleString()} followers</span>
              <span>{user.following.toLocaleString()} following</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
