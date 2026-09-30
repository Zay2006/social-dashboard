import { afterEach, describe, expect, it, vi } from "vitest";
import { readJsonStorage, readStorage, writeJsonStorage, writeStorage } from "./storage";

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

const isNumberPair = (value: unknown): value is { a: number } =>
  typeof value === "object" && value !== null && typeof (value as { a?: unknown }).a === "number";

describe("storage", () => {
  it("round-trips a value", () => {
    writeStorage("k", "v");
    expect(readStorage("k")).toBe("v");
  });

  it("returns null instead of throwing when reads are blocked", () => {
    // Private browsing and storage-disabled-by-policy both surface this way.
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(readStorage("k")).toBeNull();
  });

  it("swallows write failures such as an exceeded quota", () => {
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(() => writeStorage("k", "v")).not.toThrow();
  });

  it("discards malformed JSON rather than throwing on every load", () => {
    window.localStorage.setItem("stats", "{not json");
    expect(readJsonStorage("stats", isNumberPair)).toBeNull();
    // The bad entry is cleared so it cannot break the next load either.
    expect(window.localStorage.getItem("stats")).toBeNull();
  });

  it("rejects well-formed JSON that fails validation", () => {
    window.localStorage.setItem("stats", JSON.stringify({ a: "nope" }));
    expect(readJsonStorage("stats", isNumberPair)).toBeNull();
  });

  it("returns validated JSON", () => {
    writeJsonStorage("stats", { a: 1 });
    expect(readJsonStorage("stats", isNumberPair)).toEqual({ a: 1 });
  });
});
