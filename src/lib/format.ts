/**
 * Date and number formatting.
 *
 * Statically prerendered pages bake the *server's* locale and timezone into the
 * HTML. If the client then formats the same timestamp in the visitor's timezone
 * the text differs and React reports a hydration failure. Everything here is
 * therefore split in two:
 *
 *   - `formatAbsoluteUtc` / `formatDateUtc` are deterministic and safe to render
 *     on both the server and the first client pass.
 *   - `formatAbsoluteLocal` / `formatRelative` depend on the visitor and must
 *     only run after mount (see the `TimeStamp` component).
 */

const UTC_DATE_TIME = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
});

const UTC_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const LOCAL_DATE_TIME = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const LOCAL_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function toDate(value: string | number | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Timezone-independent, so server and client always agree. */
export function formatAbsoluteUtc(value: string | number | Date): string {
  const date = toDate(value);
  return date ? UTC_DATE_TIME.format(date) : "";
}

/** Timezone-independent date without a time component. */
export function formatDateUtc(value: string | number | Date): string {
  const date = toDate(value);
  return date ? UTC_DATE.format(date) : "";
}

/** Depends on the visitor's timezone: client-only. */
export function formatAbsoluteLocal(value: string | number | Date): string {
  const date = toDate(value);
  return date ? LOCAL_DATE_TIME.format(date) : "";
}

/** Depends on the visitor's timezone: client-only. */
export function formatDateLocal(value: string | number | Date): string {
  const date = toDate(value);
  return date ? LOCAL_DATE.format(date) : "";
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Short relative time ("just now", "12m ago", "3h ago"), falling back to an
 * absolute date beyond a week. Depends on the current time, so client-only.
 *
 * `now` is injectable so tests do not depend on the wall clock.
 */
export function formatRelative(value: string | number | Date, now: number = Date.now()): string {
  const date = toDate(value);
  if (!date) return "";

  const diff = now - date.getTime();

  // Timestamps in the future would otherwise render as "-42m ago".
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}d ago`;
  return formatDateLocal(date);
}

const COMPACT_NUMBER = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const PLAIN_NUMBER = new Intl.NumberFormat("en-US");

export function formatNumber(value: number): string {
  return PLAIN_NUMBER.format(value);
}

export function formatCompactNumber(value: number): string {
  return COMPACT_NUMBER.format(value);
}

/** Signed percentage, e.g. "+4.2%" / "-1.0%" / "0.0%". */
export function formatSignedPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
