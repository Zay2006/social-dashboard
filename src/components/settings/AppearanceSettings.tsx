"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { THEMES, useTheme, type Theme } from "@/lib/theme/ThemeContext";

const OPTIONS: Record<Theme, { label: string; description: string; icon: LucideIcon }> = {
  light: { label: "Light", description: "Always use the light theme.", icon: Sun },
  dark: { label: "Dark", description: "Always use the dark theme.", icon: Moon },
  system: {
    label: "System",
    description: "Follow your operating system setting.",
    icon: Monitor,
  },
};

export function AppearanceSettings() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Appearance</h1>
        <p className="text-sm text-muted-foreground">How the dashboard looks on this device.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Theme</CardTitle>
          <CardDescription>
            Currently showing the {resolvedTheme} theme
            {theme === "system" ? ", matching your system setting." : "."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* A radiogroup rather than a single toggle, so "system" is reachable. */}
          <div role="radiogroup" aria-label="Theme" className="grid gap-3 sm:grid-cols-3">
            {THEMES.map((option) => {
              const { label, description, icon: Icon } = OPTIONS[option];
              const selected = theme === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTheme(option)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected ? "border-primary bg-accent" : "hover:bg-accent/50",
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
