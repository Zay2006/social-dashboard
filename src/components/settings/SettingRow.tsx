"use client";

import { useId } from "react";
import { Switch } from "@/components/ui/switch";

interface SettingRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/**
 * A labelled preference toggle.
 *
 * The switch is wired to the visible label with `aria-labelledby`; without it a
 * screen reader announces an unnamed control, which is what axe flagged as a
 * critical `button-name` failure on the old settings page.
 */
export function SettingRow({ label, description, checked, onCheckedChange }: SettingRowProps) {
  const labelId = useId();
  const descriptionId = useId();

  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p id={labelId} className="text-sm font-medium">
          {label}
        </p>
        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-labelledby={labelId}
        aria-describedby={description ? descriptionId : undefined}
      />
    </div>
  );
}
