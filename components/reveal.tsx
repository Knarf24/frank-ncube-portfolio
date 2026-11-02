"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

const subscribeToHydration = () => () => undefined;
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function Reveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  // Failsafe: if the in-view observer never fires (print, full-page capture,
  // an unusual scroller), show the content anyway after a short delay. It
  // only changes what the wrapper animates to. It must never change the
  // wrapper's `key`, because that would remount the children and drop
  // keyboard focus.
  const [forceShow, setForceShow] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setForceShow(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);
  const isStatic = !hasHydrated || Boolean(reduceMotion);

  return (
    <motion.div
      key={isStatic ? "static" : "motion"}
      initial={isStatic ? false : { opacity: 0, y: 18 }}
      whileInView={isStatic ? undefined : { opacity: 1, y: 0 }}
      animate={forceShow && !isStatic ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
