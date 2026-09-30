import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("renders the image by default", () => {
    render(<Avatar src="https://example.test/a.png" name="Sarah Smith" />);
    expect(screen.getByRole("img", { name: "Sarah Smith" })).toBeVisible();
  });

  it("swaps in readable initials when the image fails", () => {
    // The previous fallback assigned innerHTML to the <img> itself. <img> is a
    // replaced void element, so the initials were never painted.
    render(<Avatar src="https://example.test/missing.png" name="Sarah Smith" />);

    fireEvent.error(screen.getByRole("img", { name: "Sarah Smith" }));

    const fallback = screen.getByRole("img", { name: "Sarah Smith" });
    expect(fallback.tagName).toBe("SPAN");
    expect(fallback).toHaveTextContent("SS");
  });

  it("uses a single initial for a mononym", () => {
    render(<Avatar src="https://example.test/missing.png" name="Prince" />);
    fireEvent.error(screen.getByRole("img", { name: "Prince" }));
    expect(screen.getByRole("img", { name: "Prince" })).toHaveTextContent("P");
  });

  it("keeps the fallback colour stable for a given name", () => {
    const { unmount } = render(<Avatar src="https://example.test/x.png" name="Mike Chen" />);
    fireEvent.error(screen.getByRole("img", { name: "Mike Chen" }));
    const first = screen.getByRole("img", { name: "Mike Chen" }).getAttribute("style");
    unmount();

    render(<Avatar src="https://example.test/x.png" name="Mike Chen" />);
    fireEvent.error(screen.getByRole("img", { name: "Mike Chen" }));
    expect(screen.getByRole("img", { name: "Mike Chen" }).getAttribute("style")).toBe(first);
  });
});
