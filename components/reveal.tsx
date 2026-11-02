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
  // an unusual scroller), show the content anyway after a short delay.
  const [forceShow, setForceShow] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setForceShow(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);
  const shouldReduceMotion = !hasHydrated || Boolean(reduceMotion) || forceShow;

  return (
    <motion.div
      key={shouldReduceMotion ? "static" : "motion"}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={
        shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
      }
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
