"use client";

import { useCallback, useState } from "react";
import { Heart, MessageCircle, Share2, UserPlus, AtSign } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TimeStamp } from "@/components/ui/timestamp";
import { getPlatform } from "@/lib/platforms";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/data/mockData";
import type { Notification, NotificationType } from "@/lib/data/generators";

const TYPE_ICON: Record<NotificationType, LucideIcon> = {
  like: Heart,
  comment: MessageCircle,
  share: Share2,
  follow: UserPlus,
  mention: AtSign,
};

const TYPE_CLASS: Record<NotificationType, string> = {
  like: "text-red-700 dark:text-red-400",
  comment: "text-blue-700 dark:text-blue-400",
  share: "text-emerald-700 dark:text-emerald-400",
  follow: "text-violet-700 dark:text-violet-400",
  mention: "text-amber-700 dark:text-amber-400",
};

interface NotificationFeedProps {
  initialNotifications: Notification[];
}

export function NotificationFeed({ initialNotifications }: NotificationFeedProps) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unread = notifications.filter((notification) => !notification.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }, []);

  const toggleRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: !item.read } : item)),
    );
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {unread === 0 ? "You are all caught up." : `${formatNumber(unread)} unread`}
          </p>
        </div>
        {/* Previously a button with no handler at all. */}
        <Button variant="outline" size="sm" onClick={markAllRead} disabled={unread === 0}>
          Mark all as read
        </Button>
      </div>

      <ul className="space-y-3">
        {notifications.map((notification) => {
          const actor = getUser(notification.userId);
          const platform = getPlatform(notification.platform);
          const Icon = TYPE_ICON[notification.type];

          return (
            <li key={notification.id}>
              <Card className={cn(!notification.read && "border-l-4 border-l-primary")}>
                <CardContent className="flex items-start gap-4 p-4">
                  <span
                    className={cn(
                      "mt-0.5 rounded-full bg-muted p-2",
                      TYPE_CLASS[notification.type],
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm", notification.read && "text-muted-foreground")}>
                      <span className="font-medium text-foreground">
                        {actor?.name ?? "Someone"}
                      </span>{" "}
                      {notification.message} on{" "}
                      <span className={platform.textClass}>{platform.label}</span>
                    </p>
                    <TimeStamp
                      value={notification.createdAt}
                      relative
                      className="text-xs text-muted-foreground"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRead(notification.id)}
                    aria-pressed={!notification.read}
                  >
                    {notification.read ? "Mark unread" : "Mark read"}
                  </Button>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
