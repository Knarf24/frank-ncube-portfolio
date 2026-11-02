import { act, cleanup, render, screen } from "@testing-library/react";
import { MotionGlobalConfig } from "motion/react";
import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "@/components/reveal";

// Controllable stand-in for IntersectionObserver. Motion keeps one shared
// observer for the whole module, so the registry is never reset, and
// scrollIntoView only fires for elements that are still on the page.
type Observed = { callback: IntersectionObserverCallback; targets: Element[] };
const observers: Observed[] = [];

class ControlledIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  private entry: Observed;

  constructor(callback: IntersectionObserverCallback) {
    this.entry = { callback, targets: [] };
    observers.push(this.entry);
  }
  disconnect() {}
  observe(target: Element) {
    this.entry.targets.push(target);
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
}

function scrollIntoView() {
  for (const { callback, targets } of observers) {
    for (const target of targets.filter((t) => t.isConnected)) {
      callback(
        [
          {
            target,
            isIntersecting: true,
            intersectionRatio: 1,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    }
  }
}

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

beforeEach(() => {
  globalThis.IntersectionObserver = ControlledIntersectionObserver;
});

describe("Reveal fallback timer", () => {
  it("does not unmount or remount its children when the timer fires", () => {
    mockReducedMotion(false);
    render(
      <Reveal>
        <Probe />
      </Reveal>,
    );
    const mountsBefore = lifecycle.mounts;
    const linkBefore = screen.getByRole("link", { name: "Case study" });

    act(() => {
      vi.advanceTimersByTime(FALLBACK_MS);
    });

    expect(lifecycle.unmounts).toBe(0);
    expect(lifecycle.mounts).toBe(mountsBefore);
    expect(screen.getByRole("link", { name: "Case study" })).toBe(linkBefore);
  });

  it("keeps keyboard focus on the same link after 2.5 seconds", () => {
    mockReducedMotion(false);
    render(
      <Reveal>
        <Probe />
      </Reveal>,
    );
    const link = screen.getByRole("link", { name: "Case study" });
    link.focus();
    expect(document.activeElement).toBe(link);

    act(() => {
      vi.advanceTimersByTime(FALLBACK_MS);
    });

    expect(link.isConnected).toBe(true);
    expect(document.activeElement).toBe(link);
  });

  it("still makes hidden content visible when the scroll watcher never fires", async () => {
    mockReducedMotion(false);
    const { container } = render(
      <Reveal>
        <Probe />
      </Reveal>,
    );

    // Armed (hidden) once mounted, waiting to be scrolled into view. The
    // style is applied on the next animation frame.
    await vi.waitFor(() =>
      expect(wrapperOf(container)).toHaveStyle({ opacity: "0" }),
    );

    act(() => {
      vi.advanceTimersByTime(FALLBACK_MS);
    });

    await vi.waitFor(() =>
      expect(wrapperOf(container)).toHaveStyle({ opacity: "1" }),
    );
  });
});

describe("Reveal scroll behavior", () => {
  it("reveals on scroll before the fallback fires, without remounting", async () => {
    mockReducedMotion(false);
    const { container } = render(
      <Reveal>
        <Probe />
      </Reveal>,
    );
    await vi.waitFor(() =>
      expect(wrapperOf(container)).toHaveStyle({ opacity: "0" }),
    );

    act(() => {
      scrollIntoView();
    });

    // Visible although the 2.5 second timer has not fired yet.
    await vi.waitFor(() =>
      expect(wrapperOf(container)).toHaveStyle({ opacity: "1" }),
    );
    expect(lifecycle.unmounts).toBe(0);
  });
});
