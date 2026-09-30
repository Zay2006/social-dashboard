import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
  ThemeProvider,
  isTheme,
  resolveTheme,
  useTheme,
} from "./ThemeContext";

function Probe() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <output data-testid="theme">{theme}</output>
      <output data-testid="resolved">{resolvedTheme}</output>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setTheme("system")}>use system</button>
    </div>
  );
}

function mockPrefersDark(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.className = "";
  vi.restoreAllMocks();
});

describe("resolveTheme", () => {
  it("passes explicit preferences through", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("follows the system setting for 'system'", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});

describe("isTheme", () => {
  it("rejects anything that is not a known theme", () => {
    // The old provider cast localStorage output straight to Theme, so a stray
    // value such as "blue" became the active theme.
    expect(isTheme("light")).toBe(true);
    expect(isTheme("system")).toBe(true);
    expect(isTheme("blue")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});

describe("THEME_INIT_SCRIPT", () => {
  it("applies the stored theme before React runs", () => {
    mockPrefersDark(false);
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("falls back to the system preference when nothing is stored", () => {
    mockPrefersDark(true);
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("ignores an invalid stored value", () => {
    mockPrefersDark(false);
    window.localStorage.setItem(THEME_STORAGE_KEY, "chartreuse");
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

describe("ThemeProvider", () => {
  it("restores a stored preference and applies the class", async () => {
    mockPrefersDark(false);
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    expect(await screen.findByText("dark", { selector: '[data-testid="theme"]' })).toBeVisible();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("resolves 'system' from the media query", async () => {
    mockPrefersDark(true);

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    expect(await screen.findByText("system", { selector: '[data-testid="theme"]' })).toBeVisible();
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
  });

  it("persists the choice when toggled", async () => {
    mockPrefersDark(false);
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("throws a useful error outside a provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/must be used within a ThemeProvider/);
    consoleError.mockRestore();
  });
});
