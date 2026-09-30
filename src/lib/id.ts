let counter = 0;

/**
 * Collision-free id for client-generated records.
 *
 * `\`${prefix}-${Date.now()}-${i}\`` is not enough: several records created inside
 * the same millisecond collide, which produces duplicate React keys.
 */
export function uid(prefix: string): string {
  counter += 1;
  const globalCrypto = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
  if (globalCrypto && typeof globalCrypto.randomUUID === "function") {
    return `${prefix}-${globalCrypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}
