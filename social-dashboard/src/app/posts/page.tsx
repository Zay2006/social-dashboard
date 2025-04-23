import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockPosts, mockUsers } from '@/lib/data/mockData';
import { Twitter, Instagram, Linkedin, Heart, Share2, MessageCircle } from 'lucide-react';

export default function PostsPage() {
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

  const getUser = (userId: string) => {
    return mockUsers.find(user => user.id === userId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Posts</h1>
      <div className="space-y-6">
        {mockPosts.map((post) => {
          const user = getUser(post.userId);
          if (!user) return null;

          return (
            <div key={post.id} className="rounded-lg border p-6 space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                  </div>
                </div>
                {getPlatformIcon(post.platform)}
              </div>
              <p className="text-lg">{post.content}</p>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex gap-6">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="w-4 h-4" />
                    <span>{post.shares.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.toLocaleString()}</span>
                  </div>
                </div>
                <time>{formatDate(post.createdAt)}</time>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
