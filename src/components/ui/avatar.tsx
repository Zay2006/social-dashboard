"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  /** Used for the alt text and to derive the fallback initials. */
  name: string;
  size?: number;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/** Deterministic hue so a given person always gets the same fallback colour. */
function hueFor(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 360;
  }
  return hash;
}

/**
 * Avatar with a fallback that actually renders.
 *
 * The previous implementation set `innerHTML` on the `<img>` inside `onError`.
 * `<img>` is a replaced void element, so those children are never painted — the
 * fallback has to be a sibling element, driven by state.
 */
export function Avatar({ src, name, size = 40, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        role="img"
        aria-label={name}
        className={cn(
          "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white",
          className,
        )}
        style={{
          width: size,
          height: size,
          fontSize: Math.max(10, Math.round(size * 0.4)),
          backgroundColor: `hsl(${hueFor(name)} 55% 38%)`,
        }}
      >
        {initials(name)}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full bg-muted", className)}
      onError={() => setFailed(true)}
      unoptimized={false}
    />
  );
}
