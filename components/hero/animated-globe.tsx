"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useSyncExternalStore, type PointerEvent } from "react";

const floatingLabels = [
  { label: "AI / ML", className: "left-0 top-[17%]" },
  { label: "Software", className: "right-0 top-[24%]" },
  { label: "Cloud", className: "bottom-[22%] left-[2%]" },
  { label: "Product builder", className: "bottom-[12%] right-0" },
] as const;

const spring = { stiffness: 90, damping: 18, mass: 0.7 };
const subscribeToHydration = () => () => undefined;
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function AnimatedGlobe() {
  const reduceMotion = useReducedMotion();
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const shouldReduceMotion = !hasHydrated || Boolean(reduceMotion);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (shouldReduceMotion || event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

    x.set(Math.max(-10, Math.min(10, offsetX * 20)));
    y.set(Math.max(-10, Math.min(10, offsetY * 20)));
  }

  function resetPointerPosition() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      data-testid="animated-globe"
      data-reduced-motion={String(shouldReduceMotion)}
      className="relative mx-auto aspect-square w-full max-w-[360px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointerPosition}
    >
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_center,var(--accent-soft),transparent_68%)] blur-2xl"
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ x: springX, y: springY }}
      >
        <div className="absolute inset-[12%] rounded-full border border-[var(--border)] bg-[radial-gradient(circle_at_36%_30%,var(--accent-soft),transparent_38%),linear-gradient(145deg,var(--surface-elevated),var(--background))] shadow-[0_0_70px_var(--accent-soft)]" />
        <div className="absolute inset-[23%] rounded-full border border-[var(--border)] bg-[radial-gradient(circle_at_center,var(--accent-soft),transparent_64%)]" />

        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 360 360"
          fill="none"
        >
          <circle
            cx="180"
            cy="180"
            r="145"
            stroke="var(--border)"
            strokeWidth="1"
          />
          <circle
            cx="180"
            cy="180"
            r="111"
            stroke="var(--accent)"
            strokeOpacity="0.14"
            strokeWidth="1"
          />

          <motion.g
            key={shouldReduceMotion ? "outer-static" : "outer-motion"}
            initial={shouldReduceMotion ? false : { rotate: 0 }}
            animate={shouldReduceMotion ? undefined : { rotate: 360 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 30, ease: "linear", repeat: Infinity }
            }
            style={{ transformOrigin: "180px 180px" }}
          >
            <g transform="rotate(-14 180 180)">
              <ellipse
                cx="180"
                cy="180"
                rx="139"
                ry="52"
                stroke="var(--accent)"
                strokeOpacity="0.36"
                strokeWidth="1.25"
              />
              <circle cx="41" cy="180" r="4" fill="var(--accent)" />
              <circle cx="319" cy="180" r="3" fill="var(--accent-strong)" />
            </g>
          </motion.g>

          <motion.g
            key={shouldReduceMotion ? "middle-static" : "middle-motion"}
            initial={shouldReduceMotion ? false : { rotate: 0 }}
            animate={shouldReduceMotion ? undefined : { rotate: -360 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 38, ease: "linear", repeat: Infinity }
            }
            style={{ transformOrigin: "180px 180px" }}
          >
            <g transform="rotate(48 180 180)">
              <ellipse
                cx="180"
                cy="180"
                rx="121"
                ry="78"
                stroke="var(--accent)"
                strokeOpacity="0.24"
                strokeWidth="1"
              />
              <circle cx="59" cy="180" r="3" fill="var(--accent)" />
              <circle cx="301" cy="180" r="4" fill="var(--accent-strong)" />
            </g>
          </motion.g>

          <motion.g
            key={shouldReduceMotion ? "inner-static" : "inner-motion"}
            initial={shouldReduceMotion ? false : { rotate: 0 }}
            animate={shouldReduceMotion ? undefined : { rotate: 360 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 46, ease: "linear", repeat: Infinity }
            }
            style={{ transformOrigin: "180px 180px" }}
          >
            <g transform="rotate(24 180 180)">
              <ellipse
                cx="180"
                cy="180"
                rx="63"
                ry="137"
                stroke="var(--accent)"
                strokeOpacity="0.2"
                strokeWidth="1"
              />
              <circle cx="117" cy="180" r="3" fill="var(--accent)" />
              <circle cx="243" cy="180" r="3.5" fill="var(--accent-strong)" />
            </g>
          </motion.g>

          <path
            d="M146 180h68M180 146v68"
            stroke="var(--accent)"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
          <circle
            cx="180"
            cy="180"
            r="34"
            fill="var(--accent-soft)"
            stroke="var(--accent)"
            strokeOpacity="0.42"
          />
        </svg>

        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center font-mono text-[11px] uppercase leading-[1.45] tracking-[0.24em] text-[var(--text)] sm:text-xs"
        >
          <span>Build</span>
          <span className="text-[var(--accent)]">Learn</span>
          <span>Ship</span>
        </div>
      </motion.div>

      <div aria-hidden="true" className="absolute inset-0">
        {floatingLabels.map(({ label, className }) => (
          <span
            key={label}
            className={`absolute ${className} rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium tracking-wide text-[var(--muted)] shadow-lg shadow-black/20 sm:text-sm`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
