import type { Metadata } from "next";
import { PostFeed } from "@/components/posts/PostFeed";
import { mockPosts } from "@/lib/data/mockData";

export const metadata: Metadata = {
  title: "Posts",
  description: "Recent posts and engagement across every connected platform.",
};

export default function PostsPage() {
  return <PostFeed initialPosts={mockPosts} />;
}
