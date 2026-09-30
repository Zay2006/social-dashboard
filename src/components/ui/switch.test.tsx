import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./switch";

function Controlled() {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <span id="label">Email digest</span>
      <Switch checked={checked} onCheckedChange={setChecked} aria-labelledby="label" />
    </>
  );
}

describe("Switch", () => {
  it("exposes a switch role with its state", () => {
    // The previous toggles were bare <button> elements wrapping an empty <div>,
    // which axe reported as a critical button-name failure with no state at all.
    render(<Controlled />);
    const toggle = screen.getByRole("switch", { name: "Email digest" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    const toggle = screen.getByRole("switch", { name: "Email digest" });

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("is operable from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    const toggle = screen.getByRole("switch", { name: "Email digest" });

    await user.tab();
    expect(toggle).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("does not fire when disabled", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Switch checked={false} onCheckedChange={onCheckedChange} disabled aria-label="Disabled" />,
    );

    await user.click(screen.getByRole("switch", { name: "Disabled" }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
