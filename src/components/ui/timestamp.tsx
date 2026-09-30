"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatAbsoluteLocal, formatAbsoluteUtc, formatRelative } from "@/lib/format";

interface TimeStampProps {
  /** An ISO 8601 timestamp. */
  value: string;
  /** Show "3h ago" instead of an absolute date once mounted. */
  relative?: boolean;
  className?: string;
}

/**
 * Renders a timestamp without tripping a hydration mismatch.
 *
 * The server (and the first client render) emit a fixed UTC string, so the two
 * passes are identical. After mount the text is upgraded to the visitor's local
 * timezone, and the machine-readable value always lives in `dateTime`.
 */
export function TimeStamp({ value, relative = false, className }: TimeStampProps) {
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    setDisplay(relative ? formatRelative(value) : formatAbsoluteLocal(value));

    if (!relative) return;
    // Keep "just now" / "5m ago" honest while the page stays open.
    const interval = window.setInterval(() => setDisplay(formatRelative(value)), 60_000);
    return () => window.clearInterval(interval);
  }, [value, relative]);

  return (
    <time dateTime={value} title={formatAbsoluteUtc(value)} className={cn(className)}>
      {display ?? formatAbsoluteUtc(value)}
    </time>
  );
}
