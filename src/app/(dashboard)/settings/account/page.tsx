import type { Metadata } from "next";
import { AccountSettings } from "@/components/settings/AccountSettings";

export const metadata: Metadata = {
  title: "Account settings",
  description: "Profile details, connected platforms and privacy preferences.",
};

export default function AccountSettingsPage() {
  return <AccountSettings />;
}
