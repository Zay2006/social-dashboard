export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  joinedDate: string;
  platforms: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
    pinterest?: string;
  };
}

export interface Post {
  id: string;
  userId: string;
  platform: 'twitter' | 'instagram' | 'linkedin' | 'tiktok' | 'youtube' | 'pinterest';
  content: string;
  likes: number;
  shares: number;
  comments: number;
  createdAt: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    bio: 'Tech enthusiast | Coffee lover | Coding @LaunchpadPhilly',
    followers: 520,
    following: 392,
    joinedDate: '2024-01-15',
    platforms: {
      twitter: '@johndoe',
      linkedin: 'john-doe-tech',
      youtube: '@johndoecodes'
    }
  },
  {
    id: '2',
    name: 'Sarah Smith',
    username: 'sarahcodes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio: 'Full-stack developer | Open source contributor',
    followers: 341,
    following: 223,
    joinedDate: '2024-02-01',
    platforms: {
      instagram: '@sarahcodes',
      tiktok: '@sarahcodes',
      pinterest: '@sarahsmith'
    }
  },
  {
    id: '3',
    name: 'Mike Chen',
    username: 'mikedev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    bio: 'Gaming streamer | Web3 developer',
    followers: 456,
    following: 234,
    joinedDate: '2024-03-15',
    platforms: {
      youtube: '@mikegaming',
      tiktok: '@mikedev',
      twitter: '@mikechen'
    }
  },
  {
    id: '4',
    name: 'Emma Wilson',
    username: 'emmaw',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    bio: 'Digital artist | UI/UX Designer',
    followers: 289,
    following: 167,
    joinedDate: '2024-02-28',
    platforms: {
      instagram: '@emmadesigns',
      pinterest: '@emmawilson',
      linkedin: 'emma-wilson-design'
    }
  },
  {
    id: '5',
    name: 'Alex Rivera',
    username: 'alexr',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'Content creator | Travel vlogger',
    followers: 623,
    following: 445,
    joinedDate: '2024-01-30',
    platforms: {
      youtube: '@alexrtravels',
      instagram: '@alexrivera',
      tiktok: '@alexrtravels'
    }
  },
  {
    id: '6',
    name: 'Lily Zhang',
    username: 'lilycode',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lily',
    bio: 'Mobile app developer | Tech blogger',
    followers: 178,
    following: 143,
    joinedDate: '2024-03-01',
    platforms: {
      twitter: '@lilyzhang',
      linkedin: 'lily-zhang-dev',
      youtube: '@lilycode'
    }
  },
  {
    id: '7',
    name: 'David Park',
    username: 'davidp',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    bio: 'Indie game developer | Pixel artist',
    followers: 245,
    following: 189,
    joinedDate: '2024-03-10',
    platforms: {
      twitter: '@davidpark',
      youtube: '@davidparkgames',
      tiktok: '@davidpixels'
    }
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    platform: 'twitter',
    content: 'Just launched a new feature for our dashboard! Check it out at launchpadphilly.com 🚀',
    likes: 45,
    shares: 12,
    comments: 8,
    createdAt: '2024-04-22T15:30:00Z'
  },
  {
    id: '2',
    userId: '2',
    platform: 'instagram',
    content: 'Another day, another bug squashed 🐛 #coding #webdev',
    likes: 89,
    shares: 0,
    comments: 15,
    createdAt: '2024-04-22T12:15:00Z'
  },
  {
    id: '3',
    userId: '3',
    platform: 'youtube',
    content: 'New video: Building a Web3 Game in 24 Hours! Like and subscribe 🎮',
    likes: 156,
    shares: 45,
    comments: 23,
    createdAt: '2024-04-21T18:45:00Z'
  },
  {
    id: '4',
    userId: '4',
    platform: 'pinterest',
    content: 'Latest UI design inspiration board: Minimalist Dashboard Designs',
    likes: 67,
    shares: 34,
    comments: 5,
    createdAt: '2024-04-21T09:20:00Z'
  }
];
