import { act, cleanup } from "@testing-library/react";
import { MotionGlobalConfig } from "motion/react";
import { useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "@/components/reveal";

// These tests cover what the other Reveal tests cannot: the server-rendered
// HTML and the hydration step that turns it into a live React tree.

const lifecycle = { mounts: 0, unmounts: 0 };

function Probe() {
  useEffect(() => {
    lifecycle.mounts += 1;
    return () => {
      lifecycle.unmounts += 1;
    };
  }, []);
  return <a href="#target">Case study</a>;
}

function tree() {
  return (
    <Reveal>
      <Probe />
    </Reveal>
  );
}

beforeEach(() => {
  MotionGlobalConfig.skipAnimations = true;
  lifecycle.mounts = 0;
  lifecycle.unmounts = 0;
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("Reveal server markup", () => {
  it("is fully visible, so content shows with JavaScript disabled", () => {
    const html = renderToString(tree());

    expect(html).toContain("Case study");
    expect(html).not.toMatch(/opacity:\s*0/);
    expect(html).not.toMatch(/translateY/);
  });
});

describe("Reveal hydration", () => {
  it("keeps the server-rendered node and its keyboard focus, and logs no warnings", async () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const warnings = vi.spyOn(console, "warn").mockImplementation(() => {});

    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = renderToString(tree());

    // A keyboard user has focused the link before React has hydrated.
    const link = container.querySelector("a") as HTMLAnchorElement;
    link.focus();
    expect(document.activeElement).toBe(link);

    await act(async () => {
      hydrateRoot(container, tree());
    });

    expect(container.querySelector("a")).toBe(link);
    expect(link.isConnected).toBe(true);
    expect(document.activeElement).toBe(link);
    expect(lifecycle.unmounts).toBe(0);
    expect(errors).not.toHaveBeenCalled();
    expect(warnings).not.toHaveBeenCalled();
  });

  it("then hides, reveals via the 2.5 second failsafe, and still never swaps the node", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = renderToString(tree());
    const link = container.querySelector("a") as HTMLAnchorElement;

    await act(async () => {
      hydrateRoot(container, tree());
    });

    const wrapper = container.firstElementChild as HTMLElement;
    // Armed after hydration.
    await vi.waitFor(() => expect(wrapper).toHaveStyle({ opacity: "0" }));

    act(() => {
      vi.advanceTimersByTime(2600);
    });

    // Revealed, with the very same wrapper and link (a section that holds
    // no focus is hidden and revealed as before).
    await vi.waitFor(() => expect(wrapper).toHaveStyle({ opacity: "1" }));
    expect(container.firstElementChild).toBe(wrapper);
    expect(container.querySelector("a")).toBe(link);
    expect(lifecycle.unmounts).toBe(0);
  });

  it("never hides a section that already holds keyboard focus", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = renderToString(tree());
    const link = container.querySelector("a") as HTMLAnchorElement;
    link.focus();

    await act(async () => {
      hydrateRoot(container, tree());
    });
    const wrapper = container.firstElementChild as HTMLElement;

    // Give motion several frames to apply any hidden style, then past the
    // failsafe: it must stay fully visible the whole time.
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      });
      expect(wrapper).not.toHaveStyle({ opacity: "0" });
    }
    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(wrapper).toHaveStyle({ opacity: "1" });
    expect(document.activeElement).toBe(link);
  });

  it("shows a hidden section the moment focus enters it, without waiting for the failsafe", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = renderToString(tree());
    const link = container.querySelector("a") as HTMLAnchorElement;

    await act(async () => {
      hydrateRoot(container, tree());
    });
    const wrapper = container.firstElementChild as HTMLElement;
    await vi.waitFor(() => expect(wrapper).toHaveStyle({ opacity: "0" }));

    // Focus arrives later, with the 2.5 second timer still pending.
    act(() => {
      link.focus();
    });

    // Visible in the same task as the focus event: no waiting for a frame.
    expect(wrapper).toHaveStyle({ opacity: "1" });
    expect(wrapper).toHaveStyle({ transform: "none" });
    expect(link.isConnected).toBe(true);
    expect(document.activeElement).toBe(link);
  });
});
