import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Ring } from "@/components/ui/8bit";

/**
 * Their landing reveal: content is uncovered by an animated clip-path rather
 * than faded, so the frame appears to open along the diagonal. We drive the
 * same 1000ms ease-in-out-cubic.
 */
export function MaskReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 1, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * The vertical hairline on the right edge of the reference site, repurposed
 * as a live deck-position rail with a travelling marker.
 */
export function EdgeRail({
  index,
  total,
  label,
}: {
  index: number;
  total: number;
  label: string;
}) {
  const pct = total > 1 ? (index / (total - 1)) * 100 : 0;

  return (
    <div
      className="pointer-events-none fixed right-0 top-0 hidden h-full w-[2px] bg-[var(--hairline)] md:block"
      aria-hidden="true"
    >
      <motion.div
        className="absolute left-0 w-full bg-[var(--cyan)]"
        initial={false}
        animate={{ top: `${pct}%` }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        style={{ height: "14%" }}
      />
    </div>
  );
}

/**
 * A ring paired with a caption — the reference's "Scroll Down To Continue"
 * affordance, reused here as a live status readout.
 */
export function RingStatus({
  text,
  size = 22,
  className = "",
}: {
  text: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Ring size={size} thickness={0.5} color="var(--cyan)" />
      <span className="u8-overline text-[var(--cyan)]">{text}</span>
    </div>
  );
}
