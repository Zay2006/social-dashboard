import { describe, expect, it } from "vitest";
import {
  formatAbsoluteUtc,
  formatCompactNumber,
  formatDateUtc,
  formatNumber,
  formatRelative,
  formatSignedPercent,
} from "./format";

describe("formatAbsoluteUtc", () => {
  // The suite runs with TZ=America/Los_Angeles (see vitest.config.ts). If these
  // functions were timezone-sensitive the assertions below would shift by 7-8
  // hours, which is exactly the drift that made /posts fail hydration.
  it("is independent of the ambient timezone", () => {
    expect(process.env.TZ).toBe("America/Los_Angeles");
    expect(formatAbsoluteUtc("2024-04-22T15:30:00Z")).toBe("Apr 22, 2024, 3:30 PM UTC");
  });

  it("keeps a timestamp on its UTC calendar day across the date boundary", () => {
    expect(formatDateUtc("2024-04-22T02:00:00Z")).toBe("Apr 22, 2024");
  });

  it("returns an empty string for unparseable input", () => {
    expect(formatAbsoluteUtc("not a date")).toBe("");
    expect(formatDateUtc("")).toBe("");
  });
});

describe("formatRelative", () => {
  const now = Date.parse("2026-09-30T12:00:00Z");

  it("describes recent timestamps", () => {
    expect(formatRelative("2026-09-30T11:59:30Z", now)).toBe("just now");
    expect(formatRelative("2026-09-30T11:45:00Z", now)).toBe("15m ago");
    expect(formatRelative("2026-09-30T09:00:00Z", now)).toBe("3h ago");
    expect(formatRelative("2026-09-28T12:00:00Z", now)).toBe("2d ago");
  });

  it("falls back to an absolute date beyond a week", () => {
    expect(formatRelative("2026-01-05T12:00:00Z", now)).toMatch(/Jan \d+, 2026/);
  });

  it("does not emit negative durations for future timestamps", () => {
    // The previous implementation produced strings such as "-120m ago".
    expect(formatRelative("2026-09-30T14:00:00Z", now)).toBe("just now");
  });
});

describe("number formatting", () => {
  it("groups thousands", () => {
    expect(formatNumber(7480)).toBe("7,480");
  });

  it("abbreviates large values for axis ticks", () => {
    expect(formatCompactNumber(6700)).toBe("6.7K");
  });

  it("signs percentages", () => {
    expect(formatSignedPercent(4.2)).toBe("+4.2%");
    expect(formatSignedPercent(-1)).toBe("-1.0%");
    expect(formatSignedPercent(0)).toBe("0.0%");
  });
});
