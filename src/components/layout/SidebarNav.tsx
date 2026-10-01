"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, FileText, LayoutDashboard, Palette, UserCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLATFORM_LIST } from "@/lib/platforms";
import { formatNumber } from "@/lib/format";
import type { PlatformBreakdown } from "@/lib/data/platformStats";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/posts", label: "Posts", icon: FileText },
  { href: "/users", label: "Users", icon: Users },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

const SETTINGS_NAV: NavItem[] = [
  { href: "/settings/account", label: "Account", icon: UserCircle },
  { href: "/settings/notifications", label: "Notifications", icon: Bell },
  { href: "/settings/appearance", label: "Appearance", icon: Palette },
];

const linkClasses = (active: boolean) =>
  cn(
    "flex items-center gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
    active && "bg-accent text-accent-foreground font-medium",
  );

interface SidebarNavProps {
  /** Per-platform figures rendered in the collapsible breakdown. */
  breakdown: PlatformBreakdown;
  /** Called after any navigation, so the mobile drawer can close itself. */
  onNavigate?: () => void;
}

export function SidebarNav({ breakdown, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="space-y-1 p-4">
      {PRIMARY_NAV.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          aria-current={pathname === href ? "page" : undefined}
          className={linkClasses(pathname === href)}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}

      <div className="pt-4">
        <h2 className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Platforms
        </h2>
        <ul className="mt-2 space-y-1">
          {PLATFORM_LIST.map((platform) => {
            const stats = breakdown[platform.id];
            const Icon = platform.icon;
            return (
              <li key={platform.id}>
                {/* A <details> disclosure keeps the expanded/collapsed state
                    exposed to assistive technology without extra ARIA. */}
                <details className="group">
                  <summary
                    className={cn(
                      "flex cursor-pointer list-none items-center justify-between rounded-lg p-2 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className={cn("h-4 w-4", platform.textClass)} aria-hidden="true" />
                      <span>{platform.label}</span>
                    </span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="h-4 w-4 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <ul className="ml-6 mt-1 space-y-1 py-1 text-xs text-muted-foreground">
                    <li className="flex justify-between gap-2">
                      <span>Followers</span>
                      <span className="font-medium text-foreground">
                        {formatNumber(stats.followers)}
                      </span>
                    </li>
                    <li className="flex justify-between gap-2">
                      <span>Posts this week</span>
                      <span className="font-medium text-foreground">
                        {formatNumber(stats.posts)}
                      </span>
                    </li>
                    <li className="flex justify-between gap-2">
                      <span>Engagement rate</span>
                      <span className="font-medium text-foreground">
                        {stats.engagementRate.toFixed(1)}%
                      </span>
                    </li>
                  </ul>
                </details>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pt-4">
        <h2 className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Settings
        </h2>
        <div className="mt-2 space-y-1">
          {SETTINGS_NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={pathname === href ? "page" : undefined}
              className={linkClasses(pathname === href)}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
