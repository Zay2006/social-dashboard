"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Comment, Post, mockPosts, mockUsers } from '@/lib/data/mockData';
import { Twitter, Instagram, Linkedin, Heart, Share2, MessageCircle, Youtube, Send } from 'lucide-react';
import { generateRandomPost } from '@/lib/data/generators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newComment, setNewComment] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const handleShare = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, shares: post.shares + 1 };
      }
      return post;
    }));
  };

  const handleComment = (post: Post) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: '1', // Using first user as the current user
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setPosts(posts.map(p => {
      if (p.id === post.id) {
        return { ...p, comments: [...p.comments, comment] };
      }
      return p;
    }));

    setNewComment('');
    setSelectedPost(null);
  };

  const loadMorePosts = () => {
    const newPost = generateRandomPost();
    setPosts([newPost, ...posts]);
  };
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
        <Button onClick={loadMorePosts} className="w-full mb-4">
          Load More Posts
        </Button>

        {posts.map((post) => {
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
              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  className="rounded-lg w-full max-h-96 object-cover"
                />
              )}
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex gap-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{post.likes.toLocaleString()}</span>
                  </button>
                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{post.shares.toLocaleString()}</span>
                  </button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="flex items-center gap-1 hover:text-green-500 transition-colors"
                        onClick={() => setSelectedPost(post)}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments.length.toLocaleString()}</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Comments</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="max-h-[400px] overflow-y-auto space-y-4">
                          {post.comments.map((comment) => {
                            const commentUser = getUser(comment.userId);
                            if (!commentUser) return null;

                            return (
                              <div key={comment.id} className="flex gap-3">
                                <img
                                  src={commentUser.avatar}
                                  alt={commentUser.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{commentUser.name}</h3>
                                    <span className="text-sm text-gray-500">
                                      {formatDate(comment.createdAt)}
                                    </span>
                                  </div>
                                  <p>{comment.content}</p>
                                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                    <button className="hover:text-red-500 transition-colors">
                                      <Heart className="w-3 h-3" />
                                    </button>
                                    <span>{comment.likes}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleComment(post);
                              }
                            }}
                          />
                          <Button onClick={() => handleComment(post)}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
