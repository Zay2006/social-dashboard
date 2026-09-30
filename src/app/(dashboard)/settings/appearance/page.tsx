import type { Metadata } from "next";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";

export const metadata: Metadata = {
  title: "Appearance",
  description: "Switch between the light, dark and system themes.",
};

export default function AppearanceSettingsPage() {
  return <AppearanceSettings />;
}
