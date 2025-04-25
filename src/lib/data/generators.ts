import { Comment, Post, mockUsers } from './mockData';

const postContents = [
  "Just launched our new feature! 🚀 Check it out and let me know what you think!",
  "Excited to share my latest project with you all! 💻",
  "Great meeting with the team today. The future is bright! ✨",
  "Thanks everyone for the amazing support! We've hit 1M users! 🎉",
  "New blog post is live! Link in bio 📝",
  "Working on something special... stay tuned! 👀",
  "Had an amazing time at #TechConf2025! Met so many inspiring people.",
  "Big announcement coming soon... 🤫",
  "Love this community! Thanks for all the feedback ❤️",
  "Just hit a major milestone! Thanks to everyone who helped us get here 🙏",
];

const commentContents = [
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
];

export const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const generateRandomComments = (count: number): Comment[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `comment-${Date.now()}-${i}`,
    userId: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
    content: commentContents[Math.floor(Math.random() * commentContents.length)],
    createdAt: generateRandomDate(new Date(2025, 0, 1), new Date()).toISOString(),
    likes: Math.floor(Math.random() * 100),
  }));
};

export const generateRandomPost = (): Post => {
  const platforms = ['twitter', 'instagram', 'linkedin', 'tiktok', 'youtube', 'pinterest'] as const;
  return {
    id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    content: postContents[Math.floor(Math.random() * postContents.length)],
    likes: Math.floor(Math.random() * 1000),
    shares: Math.floor(Math.random() * 500),
    comments: generateRandomComments(Math.floor(Math.random() * 5) + 1),
    createdAt: generateRandomDate(new Date(2025, 0, 1), new Date()).toISOString(),
    image: Math.random() > 0.5 ? `https://picsum.photos/seed/${Math.random()}/400/300` : undefined,
  };
};

export const generateRandomEngagementData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  return months.map(month => ({
    date: month,
    total: Math.floor(Math.random() * 3000) + 2000,
  }));
};

export const generateRandomFollowerGrowthData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    twitter: Math.floor(Math.random() * 4000) + 2000,
    instagram: Math.floor(Math.random() * 4000) + 2000,
    linkedin: Math.floor(Math.random() * 3000) + 1500,
    youtube: Math.floor(Math.random() * 3500) + 1800,
    tiktok: Math.floor(Math.random() * 4500) + 2200,
    pinterest: Math.floor(Math.random() * 2500) + 1200,
  }));
};

export const generateRandomPlatformPerformance = () => {
  return [
    { platform: 'Twitter', followers: Math.floor(Math.random() * 4000) + 2000 },
    { platform: 'Instagram', followers: Math.floor(Math.random() * 4000) + 2000 },
    { platform: 'LinkedIn', followers: Math.floor(Math.random() * 3000) + 1500 },
    { platform: 'YouTube', followers: Math.floor(Math.random() * 3500) + 1800 },
    { platform: 'TikTok', followers: Math.floor(Math.random() * 4500) + 2200 },
    { platform: 'Pinterest', followers: Math.floor(Math.random() * 2500) + 1200 },
  ];
};

export const generateRandomNotification = () => {
  const types = ['like', 'comment', 'follow', 'share', 'mention'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  
  const messages = {
    like: `liked your post`,
    comment: `commented on your post`,
    follow: `started following you`,
    share: `shared your post`,
    mention: `mentioned you in a post`,
  };

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    userId: user.id,
    message: messages[type],
    createdAt: generateRandomDate(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()).toISOString(),
    read: false,
  };
};

export const generateRandomNotifications = (count: number) => {
  return Array.from({ length: count }, () => generateRandomNotification());
};
