"use client";

import { motion, useReducedMotion } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";

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
  const shouldReduceMotion = !hasHydrated || Boolean(reduceMotion);

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
