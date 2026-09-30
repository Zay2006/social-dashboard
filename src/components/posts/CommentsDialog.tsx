"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TimeStamp } from "@/components/ui/timestamp";
import { formatNumber } from "@/lib/format";
import { getUser, type Post } from "@/lib/data/mockData";

interface CommentsDialogProps {
  post: Post;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
}

export function CommentsDialog({ post, onAddComment, onLikeComment }: CommentsDialogProps) {
  // Scoped to this post. A single page-level draft leaked whatever you typed
  // for one post into the next one you opened.
  const [draft, setDraft] = useState("");
  const inputId = `comment-input-${post.id}`;

  const submit = () => {
    const content = draft.trim();
    if (!content) return;
    onAddComment(post.id, content);
    setDraft("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          <span>{formatNumber(post.comments.length)}</span>
          <span className="sr-only">comments</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] grid-rows-[auto_1fr_auto]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>
            {post.comments.length === 0
              ? "No comments yet. Be the first to reply."
              : `${formatNumber(post.comments.length)} comment${
                  post.comments.length === 1 ? "" : "s"
                } on this post.`}
          </DialogDescription>
        </DialogHeader>

        <ul className="min-h-0 space-y-4 overflow-y-auto pr-1">
          {post.comments.map((comment) => {
            const author = getUser(comment.userId);
            if (!author) return null;

            return (
              <li key={comment.id} className="flex gap-3">
                <Avatar src={author.avatar} name={author.name} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{author.name}</p>
                    <TimeStamp
                      value={comment.createdAt}
                      relative
                      className="text-xs text-muted-foreground"
                    />
                  </div>
                  <p className="break-words text-sm">{comment.content}</p>
                  <button
                    type="button"
                    onClick={() => onLikeComment(post.id, comment.id)}
                    className="mt-1 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Heart className="h-3 w-3" aria-hidden="true" />
                    <span>{formatNumber(comment.likes)}</span>
                    <span className="sr-only">Like this comment</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label htmlFor={inputId} className="sr-only">
              Write a comment
            </label>
            <Input
              id={inputId}
              placeholder="Write a comment…"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit();
                }
              }}
            />
          </div>
          <Button onClick={submit} disabled={!draft.trim()}>
            <Send className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Post comment</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
