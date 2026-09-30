import type { PlatformId } from "@/lib/platforms";
import { CURRENT_USER_ID, getUser } from "@/lib/data/mockData";

export interface ConnectedAccount {
  platform: PlatformId;
  handle: string;
  lastSync: string;
}

/**
 * Profile details for the signed-in account. Derived from `mockUsers` so the
 * account page and the users page cannot disagree about who is signed in — they
 * previously showed "John Smith" and "John Doe" respectively.
 */
export const currentUser = getUser(CURRENT_USER_ID)!;

export const accountProfile = {
  name: currentUser.name,
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "Philadelphia, PA",
  company: "LaunchPad Philly",
  website: "https://johndoe.dev",
} as const;

export const connectedAccounts: ConnectedAccount[] = [
  { platform: "twitter", handle: "@johndoe", lastSync: "2026-09-29T10:30:00Z" },
  { platform: "linkedin", handle: "john-doe-tech", lastSync: "2026-09-29T09:05:00Z" },
  { platform: "youtube", handle: "@johndoecodes", lastSync: "2026-09-28T22:40:00Z" },
];

export interface NotificationPreferences {
  emailDigest: boolean;
  pushAlerts: boolean;
  weeklyReport: boolean;
  mentions: boolean;
  newFollowers: boolean;
}

export const defaultNotificationPreferences: NotificationPreferences = {
  emailDigest: true,
  pushAlerts: false,
  weeklyReport: true,
  mentions: true,
  newFollowers: false,
};

export interface PrivacyPreferences {
  dataSharing: boolean;
  publicProfile: boolean;
}

export const defaultPrivacyPreferences: PrivacyPreferences = {
  dataSharing: false,
  publicProfile: true,
};
