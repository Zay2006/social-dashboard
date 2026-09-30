import { uid } from "@/lib/id";
import { PLATFORM_IDS, type PlatformId } from "@/lib/platforms";
import { pick, randomInt } from "@/lib/data/random";
import { CURRENT_USER_ID, mockUsers, type Comment, type Post } from "@/lib/data/mockData";

const POST_CONTENTS = [
  "Just launched our new feature! 🚀 Check it out and let me know what you think!",
  "Excited to share my latest project with you all! 💻",
  "Great meeting with the team today. The future is bright! ✨",
  "Thanks everyone for the amazing support! We've hit 1M users! 🎉",
  "New blog post is live! Link in bio 📝",
  "Working on something special... stay tuned! 👀",
  "Had an amazing time at #TechConf! Met so many inspiring people.",
  "Big announcement coming soon... 🤫",
  "Love this community! Thanks for all the feedback ❤️",
  "Just hit a major milestone! Thanks to everyone who helped us get here 🙏",
] as const;

const COMMENT_CONTENTS = [
  "This is amazing! 🙌",
  "Great work! Keep it up 👏",
  "Can't wait to see more!",
  "Congratulations! 🎉",
  "This is exactly what I needed!",
  "Fantastic progress!",
  "Love the new features!",
  "Looking forward to what's next!",
  "Count me in! 🚀",
  "This is game-changing!",
] as const;

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

interface GenerateOptions {
  /** Newest allowed timestamp; generated posts are older than this. */
  before: number;
  random?: () => number;
}

function generateComments(count: number, postedAt: number, random: () => number): Comment[] {
  return Array.from({ length: count }, (_, index) => ({
    id: uid("comment"),
    userId: pick(random, mockUsers).id,
    content: pick(random, COMMENT_CONTENTS),
    // Comments land after their post, spaced out so the thread reads in order.
    createdAt: new Date(
      postedAt + (index + 1) * randomInt(random, 3, 90) * MINUTE_MS,
    ).toISOString(),
    likes: randomInt(random, 0, 60),
  }));
}

/**
 * Builds one synthetic post strictly older than `before`, so a feed built by
 * repeated calls stays in descending chronological order.
 */
export function generatePost({ before, random = Math.random }: GenerateOptions): Post {
  const createdAt = before - randomInt(random, 2, 20) * HOUR_MS;
  const platform: PlatformId = pick(random, PLATFORM_IDS);

  return {
    id: uid("post"),
    userId: pick(random, mockUsers).id,
    platform,
    content: pick(random, POST_CONTENTS),
    likes: randomInt(random, 0, 800),
    shares: randomInt(random, 0, 320),
    comments: generateComments(randomInt(random, 0, 4), createdAt, random),
    createdAt: new Date(createdAt).toISOString(),
    image:
      random() > 0.5
        ? `https://picsum.photos/seed/${uid("img").replace(/[^a-z0-9]/gi, "")}/800/400`
        : undefined,
  };
}

/** A page of synthetic posts, each older than the last. */
export function generatePostPage(count: number, before: number, random = Math.random): Post[] {
  const posts: Post[] = [];
  let cursor = before;
  for (let i = 0; i < count; i += 1) {
    const post = generatePost({ before: cursor, random });
    cursor = new Date(post.createdAt).getTime();
    posts.push(post);
  }
  return posts;
}

export type NotificationType = "like" | "comment" | "follow" | "share" | "mention";

export interface Notification {
  id: string;
  type: NotificationType;
  platform: PlatformId;
  userId: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const NOTIFICATION_TYPES: readonly NotificationType[] = [
  "like",
  "comment",
  "follow",
  "share",
  "mention",
];

const NOTIFICATION_MESSAGES: Record<NotificationType, string> = {
  like: "liked your post",
  comment: "commented on your post",
  follow: "started following you",
  share: "shared your post",
  mention: "mentioned you in a post",
};

/**
 * Notifications for the last `withinHours`, newest first.
 *
 * `now` is a parameter rather than a `Date.now()` call so callers can keep the
 * value stable across renders.
 */
export function generateNotifications(
  count: number,
  now: number,
  random = Math.random,
): Notification[] {
  const others = mockUsers.filter((user) => user.id !== CURRENT_USER_ID);
  let cursor = now - randomInt(random, 1, 20) * MINUTE_MS;

  return Array.from({ length: count }, (_, index) => {
    const type = pick(random, NOTIFICATION_TYPES);
    const user = pick(random, others);
    cursor -= randomInt(random, 20, 400) * MINUTE_MS;

    return {
      id: uid("notification"),
      type,
      platform: pick(random, PLATFORM_IDS),
      userId: user.id,
      message: NOTIFICATION_MESSAGES[type],
      createdAt: new Date(cursor).toISOString(),
      // Only the newest few are unread, which is how a real inbox behaves.
      read: index > 2,
    };
  });
}
