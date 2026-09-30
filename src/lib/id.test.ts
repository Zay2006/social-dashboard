import { describe, expect, it, vi } from "vitest";
import { uid } from "./id";

describe("uid", () => {
  it("is unique across calls within the same millisecond", () => {
    // `comment-${Date.now()}-${i}` collided here, producing duplicate React keys.
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);
    const ids = Array.from({ length: 500 }, () => uid("comment"));
    expect(new Set(ids).size).toBe(ids.length);
    vi.restoreAllMocks();
  });

  it("keeps the prefix", () => {
    expect(uid("post")).toMatch(/^post-/);
  });

  it("falls back when crypto.randomUUID is unavailable", () => {
    const original = globalThis.crypto;
    Object.defineProperty(globalThis, "crypto", { value: {}, configurable: true });
    try {
      const ids = Array.from({ length: 100 }, () => uid("x"));
      expect(new Set(ids).size).toBe(ids.length);
    } finally {
      Object.defineProperty(globalThis, "crypto", { value: original, configurable: true });
    }
  });
});
