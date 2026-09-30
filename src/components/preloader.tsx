import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Ring } from "@/components/ui/8bit";

/**
 * The 8bit.ai preloader: a black curtain holding a centred wordmark and a
 * hairline ring, then a 1000ms ease-in-out-cubic fade once the deck is ready.
 *
 * Runs at most once per session so it never interrupts slide-to-slide
 * navigation. Honours prefers-reduced-motion by skipping straight through.
 */
const HOLD_MS = 900;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export function Preloader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"hold" | "exit" | "gone">("hold");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only the very first visit of a session gets the curtain.
    const KEY = "alethia:preloader";
    if (window.sessionStorage.getItem(KEY) === "done") {
      setPhase("gone");
      return;
    }
    window.sessionStorage.setItem(KEY, "done");

    if (reduced) {
      setPhase("gone");
      return;
    }

    const exit = window.setTimeout(() => setPhase("exit"), HOLD_MS);
    const done = window.setTimeout(() => setPhase("gone"), HOLD_MS + 1000);

    return () => {
      window.clearTimeout(exit);
      window.clearTimeout(done);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {phase !== "gone" && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[var(--ink-0)]"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "exit" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: phase === "exit" ? 0 : 1, y: 0 }}
              transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
              className="font-condensed text-[15px] @xl:text-[22px] font-semibold tracking-[0.26em] text-white uppercase whitespace-nowrap"
            >
              Alethia
            </motion.div>
          </div>

          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "exit" ? 0 : 0.9 }}
              transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
            >
              <Ring size={230} thickness={0.2} color="var(--cyan)" />
            </motion.div>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
