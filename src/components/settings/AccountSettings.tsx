"use client";

import { useState } from "react";
import { Building2, Globe, Mail, MapPin, Phone, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeStamp } from "@/components/ui/timestamp";
import { SettingRow } from "@/components/settings/SettingRow";
import { getPlatform } from "@/lib/platforms";
import { cn } from "@/lib/utils";
import {
  accountProfile,
  connectedAccounts,
  defaultPrivacyPreferences,
  type PrivacyPreferences,
} from "@/lib/data/accountData";

const PROFILE_FIELDS: Array<{ icon: LucideIcon; label: string; value: string; href?: string }> = [
  { icon: User, label: "Name", value: accountProfile.name },
  {
    icon: Mail,
    label: "Email",
    value: accountProfile.email,
    href: `mailto:${accountProfile.email}`,
  },
  { icon: Phone, label: "Phone", value: accountProfile.phone, href: `tel:${accountProfile.phone}` },
  { icon: MapPin, label: "Location", value: accountProfile.location },
  { icon: Building2, label: "Company", value: accountProfile.company },
  { icon: Globe, label: "Website", value: accountProfile.website, href: accountProfile.website },
];

export function AccountSettings() {
  // Real state, so the toggles respond. They were previously bound to a module
  // constant with no change handler.
  const [privacy, setPrivacy] = useState<PrivacyPreferences>(defaultPrivacyPreferences);

  const update =
    <K extends keyof PrivacyPreferences>(key: K) =>
    (value: PrivacyPreferences[K]) =>
      setPrivacy((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">
          Your profile, connected platforms and privacy choices.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal information</CardTitle>
          <CardDescription>How you appear to the rest of your team.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            {PROFILE_FIELDS.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="truncate text-sm">
                    {href ? (
                      <a href={href} className="hover:underline">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connected accounts</CardTitle>
          <CardDescription>Platforms this dashboard pulls metrics from.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {connectedAccounts.map((account) => {
              const platform = getPlatform(account.platform);
              const Icon = platform.icon;
              return (
                <li
                  key={account.platform}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                >
                  <span className={cn("flex items-center gap-2 text-sm", platform.textClass)}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">{platform.label}: </span>
                    <span>{account.handle}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      Last synced <TimeStamp value={account.lastSync} relative />
                    </span>
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                      Connected
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Privacy</CardTitle>
          <CardDescription>
            Notification preferences now live under Settings → Notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <SettingRow
            label="Public profile"
            description="Let anyone with the link view your aggregated stats."
            checked={privacy.publicProfile}
            onCheckedChange={update("publicProfile")}
          />
          <SettingRow
            label="Share usage data"
            description="Help improve the product with anonymised usage analytics."
            checked={privacy.dataSharing}
            onCheckedChange={update("dataSharing")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
