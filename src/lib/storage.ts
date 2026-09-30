/**
 * `localStorage` access that cannot throw.
 *
 * Reads and writes fail in a handful of ordinary situations — Safari private
 * browsing, storage disabled by policy, quota exhausted — and an unhandled
 * throw here takes down the whole page.
 */

export function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Persistence is a nicety here; losing it must not break the UI.
  }
}

export function removeStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignored for the same reason as `writeStorage`.
  }
}

/**
 * Reads and validates JSON from storage. Anything malformed is discarded rather
 * than left in place to break every subsequent load.
 */
export function readJsonStorage<T>(key: string, isValid: (value: unknown) => value is T): T | null {
  const raw = readStorage(key);
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isValid(parsed)) return parsed;
  } catch {
    // Fall through to the cleanup below.
  }
  removeStorage(key);
  return null;
}

export function writeJsonStorage(key: string, value: unknown): void {
  try {
    writeStorage(key, JSON.stringify(value));
  } catch {
    // Values containing cycles cannot be serialised; nothing to recover.
  }
}
