/**
 * Seeded pseudo-random numbers.
 *
 * The dashboard is a demo with no backend, so its figures are synthesised. They
 * still have to be *deterministic* for a given seed: a bare `Math.random()` in a
 * component's initial state produces different values on the server and on the
 * client, which is a hydration mismatch waiting to happen, and it also makes the
 * charts jump to unrelated values on every refresh instead of showing a trend.
 */

/** mulberry32 — small, fast, and good enough for synthetic chart data. */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable 32-bit hash, for turning a label into a seed. */
export function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function randomInt(random: () => number, min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

export function pick<T>(random: () => number, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

/**
 * Advances `value` by at most `volatility` (as a fraction of the range) and
 * clamps the result, producing a series that drifts instead of teleporting.
 */
export function walk(
  random: () => number,
  value: number,
  min: number,
  max: number,
  volatility = 0.04,
): number {
  const step = (random() * 2 - 1) * (max - min) * volatility;
  return Math.round(clamp(value + step, min, max));
}
