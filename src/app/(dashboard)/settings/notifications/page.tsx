import type { Metadata } from "next";
import { NotificationSettings } from "@/components/settings/NotificationSettings";

export const metadata: Metadata = {
  title: "Notification settings",
  description: "Choose which activity reaches you and through which channel.",
};

export default function NotificationSettingsPage() {
  return <NotificationSettings />;
}
