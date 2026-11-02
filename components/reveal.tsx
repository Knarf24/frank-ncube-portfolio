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

  // Arm the hidden state once the page is interactive (never on the server,
  // and never for reduced motion).
  useLayoutEffect(() => {
    if (reduceMotion) {
      opacity.set(1);
      y.set(0);
      return;
    }
    opacity.set(0);
    y.set(HIDDEN_OFFSET);
  }, [reduceMotion, opacity, y]);

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (reduceMotion || !shouldShow) return;
    const controls = [
      animate(opacity, 1, TRANSITION),
      animate(y, 0, TRANSITION),
    ];
    return () => controls.forEach((control) => control.stop());
  }, [reduceMotion, shouldShow, opacity, y]);

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}
