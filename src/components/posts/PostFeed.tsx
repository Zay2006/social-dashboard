"use client";

import { useCallback, useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/posts/PostCard";
import { uid } from "@/lib/id";
import { generatePostPage } from "@/lib/data/generators";
import { CURRENT_USER_ID, type Comment, type Post } from "@/lib/data/mockData";

const PAGE_SIZE = 3;
const MAX_POSTS = 24;

interface PostFeedProps {
  initialPosts: Post[];
}

export function PostFeed({ initialPosts }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);

  const sorted = useMemo(
    () =>
      [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [posts],
  );

  /**
   * Every mutation uses the updater form. Reading `posts` from the render
   * closure meant two clicks batched into one render produced a single
   * increment, silently dropping likes and shares.
   */
  const updatePost = useCallback((postId: string, update: (post: Post) => Post) => {
    setPosts((current) => current.map((post) => (post.id === postId ? update(post) : post)));
  }, []);

  const handleLike = useCallback(
    (postId: string) => updatePost(postId, (post) => ({ ...post, likes: post.likes + 1 })),
    [updatePost],
  );

  const handleShare = useCallback(
    (postId: string) => updatePost(postId, (post) => ({ ...post, shares: post.shares + 1 })),
    [updatePost],
  );

  const handleAddComment = useCallback(
    (postId: string, content: string) => {
      const comment: Comment = {
        id: uid("comment"),
        userId: CURRENT_USER_ID,
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      updatePost(postId, (post) => ({ ...post, comments: [...post.comments, comment] }));
    },
    [updatePost],
  );

  const handleLikeComment = useCallback(
    (postId: string, commentId: string) =>
      updatePost(postId, (post) => ({
        ...post,
        comments: post.comments.map((comment) =>
          comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment,
        ),
      })),
    [updatePost],
  );

  /** Appends older posts, which is what "Load more" claims to do. */
  const loadMore = useCallback(() => {
    setLoading(true);
    setPosts((current) => {
      const oldest = current.reduce(
        (min, post) => Math.min(min, new Date(post.createdAt).getTime()),
        Date.now(),
      );
      const remaining = Math.min(PAGE_SIZE, MAX_POSTS - current.length);
      if (remaining <= 0) return current;
      return [...current, ...generatePostPage(remaining, oldest)];
    });
    setLoading(false);
  }, []);

  const exhausted = posts.length >= MAX_POSTS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
        <p className="text-sm text-muted-foreground">
          Recent activity across every connected platform.
        </p>
      </div>

      <div className="space-y-4">
        {sorted.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onShare={handleShare}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />
        ))}
      </div>

      <div className="flex justify-center">
        {exhausted ? (
          <p className="text-sm text-muted-foreground">You have reached the end of the feed.</p>
        ) : (
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Load older posts
          </Button>
        )}
      </div>
    </div>
  );
}
