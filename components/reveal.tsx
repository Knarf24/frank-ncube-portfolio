"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const FALLBACK_MS = 2500;
const HIDDEN_OFFSET = 18;
const TRANSITION = { duration: 0.45, ease: "easeOut" } as const;

// Fades a section in as it scrolls into view.
//
// The server renders the section fully visible, so it shows with JavaScript
// disabled and before hydration. After hydration it is hidden, then revealed
// when scrolled into view, or after FALLBACK_MS if the in-view observer never
// fires (print, full-page capture, an unusual scroller). Reduced motion keeps
// it visible throughout.
//
// Focus always wins: a section that holds keyboard focus is never hidden, and
// focus arriving in a hidden section shows it at once, so a focus ring is
// never invisible or half-faded.
//
// This is ONE stable element for its whole life: nothing here may change a
// `key` or the element type, because that would replace the server-rendered
// children with new DOM nodes and drop keyboard focus during hydration.
export function Reveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const opacity = useMotionValue(1);
  const y = useMotionValue(0);
  const inView = useInView(ref, { once: true, amount: 0.18 });
  const [timedOut, setTimedOut] = useState(false);
  const shouldShow = inView || timedOut;
  const controls = useRef<ReturnType<typeof animate>[]>([]);

  // Arm the hidden state once the page is interactive (never on the server,
  // and never for reduced motion).
  useLayoutEffect(() => {
    if (reduceMotion) {
      opacity.set(1);
      y.set(0);
      return;
    }
    // Focus was set before hydration (or before this effect ran): leave the
    // section visible instead of hiding the focused element.
    if (ref.current?.contains(document.activeElement)) return;
    opacity.set(0);
    y.set(HIDDEN_OFFSET);
  }, [reduceMotion, opacity, y]);

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (reduceMotion || !shouldShow) return;
    controls.current = [
      animate(opacity, 1, TRANSITION),
      animate(y, 0, TRANSITION),
    ];
    return () => controls.current.forEach((control) => control.stop());
  }, [reduceMotion, shouldShow, opacity, y]);

  // Focus entering the section (React's onFocus bubbles, like focusin): show
  // it immediately, cancelling any fade that is still running.
  const showNow = () => {
    controls.current.forEach((control) => control.stop());
    opacity.set(1);
    y.set(0);
    // motion applies the values on the next animation frame. Write the visible
    // style now as well, so the focused element is never hidden for even one
    // frame (browsers can delay frames). It matches what motion renders next.
    if (ref.current) {
      ref.current.style.opacity = "1";
      ref.current.style.transform = "none";
    }
  };

  return (
    <motion.div ref={ref} style={{ opacity, y }} onFocus={showNow}>
      {children}
    </motion.div>
  );
}
