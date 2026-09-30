"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { TimeStamp } from "@/components/ui/timestamp";
import { CommentsDialog } from "@/components/posts/CommentsDialog";
import { getPlatform } from "@/lib/platforms";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getUser, type Post } from "@/lib/data/mockData";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
}

export function PostCard({ post, onLike, onShare, onAddComment, onLikeComment }: PostCardProps) {
  const author = getUser(post.userId);
  const [imageFailed, setImageFailed] = useState(false);

  if (!author) return null;

  const platform = getPlatform(post.platform);
  const PlatformIcon = platform.icon;

  return (
    <Card asChild>
      <article>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar src={author.avatar} name={author.name} size={40} />
              <div>
                <h2 className="font-semibold leading-tight">{author.name}</h2>
                <p className="text-sm text-muted-foreground">@{author.username}</p>
              </div>
            </div>
            <span className={cn("flex items-center gap-1 text-sm", platform.textClass)}>
              <PlatformIcon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Posted on </span>
              <span>{platform.label}</span>
            </span>
          </div>

          <p className="break-words">{post.content}</p>

          {post.image && !imageFailed && (
            // A fixed aspect ratio with `fill` avoids both layout shift and the
            // "width or height modified, but not the other" warning that a
            // `w-full` class on a sized <Image> produces.
            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={post.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-cover"
                onError={() => setImageFailed(true)}
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <div className="flex gap-5">
              <button
                type="button"
                onClick={() => onLike(post.id)}
                className="flex items-center gap-1 transition-colors hover:text-destructive"
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
                <span>{formatNumber(post.likes)}</span>
                <span className="sr-only">likes</span>
              </button>
              <button
                type="button"
                onClick={() => onShare(post.id)}
                className="flex items-center gap-1 transition-colors hover:text-foreground"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                <span>{formatNumber(post.shares)}</span>
                <span className="sr-only">shares</span>
              </button>
              <CommentsDialog
                post={post}
                onAddComment={onAddComment}
                onLikeComment={onLikeComment}
              />
            </div>
            <TimeStamp value={post.createdAt} relative />
          </div>
        </CardContent>
      </article>
    </Card>
  );
}
