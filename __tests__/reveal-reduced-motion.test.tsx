import { act, cleanup, render, screen } from "@testing-library/react";
import { MotionGlobalConfig } from "motion/react";
import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "@/components/reveal";

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

// The failsafe in components/reveal.tsx fires after 2.5 seconds.
const FALLBACK_MS = 2600;

function wrapperOf(container: HTMLElement) {
  return container.firstElementChild as HTMLElement;
}

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

beforeEach(() => {
  // Animations jump to their end state. Only the failsafe timer is faked:
  // motion drives its frames with the real requestAnimationFrame.
  MotionGlobalConfig.skipAnimations = true;
  lifecycle.mounts = 0;
  lifecycle.unmounts = 0;
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

// Motion reads the reduced-motion setting once per module, so this case has
// its own file instead of sharing reveal.test.tsx.
describe("Reveal with reduced motion", () => {
  it("shows content immediately, never hides it, and never remounts", () => {
    mockReducedMotion(true);
    const { container } = render(
      <Reveal>
        <Probe />
      </Reveal>,
    );
    const link = screen.getByRole("link", { name: "Case study" });
    link.focus();

    expect(wrapperOf(container)).not.toHaveStyle({ opacity: "0" });

    act(() => {
      vi.advanceTimersByTime(FALLBACK_MS);
    });

    expect(wrapperOf(container)).not.toHaveStyle({ opacity: "0" });
    expect(lifecycle.unmounts).toBe(0);
    expect(screen.getByRole("link", { name: "Case study" })).toBe(link);
    expect(document.activeElement).toBe(link);
  });
});
