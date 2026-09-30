import type { Metadata } from "next";
import { NotificationFeed } from "@/components/notifications/NotificationFeed";
import { generateNotifications } from "@/lib/data/generators";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Likes, comments, shares, follows and mentions from every platform.",
};

/**
 * Rendered per request rather than prerendered: the feed is generated relative to
 * "now", and a build-time snapshot would slowly drift into showing every
 * notification as months old.
 */
export const dynamic = "force-dynamic";

export default function NotificationsPage() {
  return <NotificationFeed initialNotifications={generateNotifications(8, Date.now())} />;
}
