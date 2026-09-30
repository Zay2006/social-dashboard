import { describe, expect, it } from "vitest";
import { PLATFORMS, PLATFORM_IDS, PLATFORM_LIST, getPlatform, isPlatformId } from "./platforms";

describe("platform metadata", () => {
  it("has an entry for every platform id", () => {
    // getPlatformIcon used to return null for TikTok, YouTube and Pinterest,
    // leaving those rows without an icon.
    for (const id of PLATFORM_IDS) {
      const platform = getPlatform(id);
      expect(platform.id).toBe(id);
      expect(platform.icon).toBeTruthy();
      expect(platform.label).not.toHaveLength(0);
      expect(platform.textClass).toContain("dark:");
      expect(platform.chartColor.light).toMatch(/^#[0-9a-f]{6}$/i);
      expect(platform.chartColor.dark).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("uses brand capitalisation that CSS `capitalize` cannot produce", () => {
    expect(PLATFORMS.tiktok.label).toBe("TikTok");
    expect(PLATFORMS.youtube.label).toBe("YouTube");
    expect(PLATFORMS.linkedin.label).toBe("LinkedIn");
  });

  it("gives every platform a distinct chart colour per theme", () => {
    for (const theme of ["light", "dark"] as const) {
      const colours = PLATFORM_LIST.map((platform) => platform.chartColor[theme]);
      expect(new Set(colours).size).toBe(colours.length);
    }
  });

  it("avoids pure black and pure white, which vanish on one of the themes", () => {
    for (const platform of PLATFORM_LIST) {
      expect(platform.chartColor.light.toLowerCase()).not.toBe("#000000");
      expect(platform.chartColor.dark.toLowerCase()).not.toBe("#000000");
      expect(platform.chartColor.dark.toLowerCase()).not.toBe("#ffffff");
    }
  });

  it("narrows unknown values", () => {
    expect(isPlatformId("twitter")).toBe(true);
    expect(isPlatformId("myspace")).toBe(false);
    expect(isPlatformId(undefined)).toBe(false);
  });
});
