"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingRow } from "@/components/settings/SettingRow";
import {
  defaultNotificationPreferences,
  type NotificationPreferences,
} from "@/lib/data/accountData";

const CHANNELS: Array<{
  key: keyof NotificationPreferences;
  label: string;
  description: string;
}> = [
  {
    key: "emailDigest",
    label: "Email digest",
    description: "A single daily email summarising activity across all platforms.",
  },
  {
    key: "pushAlerts",
    label: "Push alerts",
    description: "Immediate browser notifications for high-priority activity.",
  },
  {
    key: "weeklyReport",
    label: "Weekly report",
    description: "Monday morning breakdown of reach, engagement and growth.",
  },
];

const EVENTS: Array<{
  key: keyof NotificationPreferences;
  label: string;
  description: string;
}> = [
  {
    key: "mentions",
    label: "Mentions",
    description: "Someone mentions one of your connected handles.",
  },
  {
    key: "newFollowers",
    label: "New followers",
    description: "An account starts following you on any platform.",
  },
];

/**
 * Actual notification *preferences*. The route used to render a notification
 * feed under a "Notification Settings" heading, while the real preference
 * toggles sat on the Account page.
 */
export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    defaultNotificationPreferences,
  );

  const update =
    <K extends keyof NotificationPreferences>(key: K) =>
    (value: NotificationPreferences[K]) =>
      setPreferences((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notification settings</h1>
        <p className="text-sm text-muted-foreground">
          Choose what reaches you and how. Looking for your activity?{" "}
          <Link href="/notifications" className="underline underline-offset-4">
            Open the notification feed
          </Link>
          .
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Delivery channels</CardTitle>
          <CardDescription>How notifications reach you.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {CHANNELS.map(({ key, label, description }) => (
            <SettingRow
              key={key}
              label={label}
              description={description}
              checked={preferences[key]}
              onCheckedChange={update(key)}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Events</CardTitle>
          <CardDescription>Which activity is worth notifying you about.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {EVENTS.map(({ key, label, description }) => (
            <SettingRow
              key={key}
              label={label}
              description={description}
              checked={preferences[key]}
              onCheckedChange={update(key)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
