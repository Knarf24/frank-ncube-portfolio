"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

type RotatingRoleProps = {
  roles: string[];
  intervalMs?: number;
  suffix?: string;
};

const subscribeToHydration = () => () => undefined;
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function RotatingRole({
  roles,
  intervalMs = 2200,
  suffix = "",
}: RotatingRoleProps) {
  const reduceMotion = useReducedMotion();
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const shouldReduceMotion = !hasHydrated || Boolean(reduceMotion);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || roles.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % roles.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, roles.length, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <span className="text-[var(--accent)]">
        {roles[0]}
        {suffix}
      </span>
    );
  }

  return (
    <span className="relative inline-grid min-w-[16ch] align-bottom text-[var(--accent)]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={roles[index]}
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {roles[index]}
          {suffix}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
