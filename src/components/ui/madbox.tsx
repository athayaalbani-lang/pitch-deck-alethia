import React from "react";

/**
 * Interaction primitives lifted from madbox.io.
 *
 * That site is GSAP + Three.js. What survives the port to a slide deck is the
 * CSS layer: the 6-second `bounce` keyframe on their experience pins, the
 * `easeOutQuad` they use on every transition, the overshooting `easeOutBack`
 * on their header, and the staggered reveal pattern. Reproduced exactly —
 * same percentages, same durations, same stagger step.
 */

const EASE = "cubic-bezier(0.215, 0.61, 0.355, 1)";
const EASE_BACK = "cubic-bezier(0.175, 0.885, 0.32, 1.275)";

/**
 * Their pin pulse: scale 1 -> 1.2 -> 0.95 -> 1 over 6s, offset per index by
 * 0.1s so a row of them ripples instead of blinking in unison.
 */
export function Pulse({
  children,
  index = 0,
  className = "",
  style,
}: {
  children?: React.ReactNode;
  /** Drives the 0.1s stagger step. */
  index?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`inline-flex ${className}`}
      style={{ ...style, ["--mb-index" as string]: index }}
      data-mb-pulse=""
    >
      {children}
    </span>
  );
}

/**
 * Slow vertical drift, the read as "floating landmass" rather than pulsing
 * marker. Layer it under or over a Pulse for the full island effect.
 */
export function Float({
  children,
  index = 0,
  className = "",
  style,
}: {
  children?: React.ReactNode;
  index?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`mb-drift ${className}`}
      style={{ ...style, ["--mb-index" as string]: index }}
    >
      {children}
    </div>
  );
}

/**
 * Their reveal: opacity 0 with a 50px offset, settling over 0.4s, delayed by
 * 0.5s + index * 0.04s. Direction switches between entrances.
 */
export function Stagger({
  children,
  index = 0,
  from = "left",
  className = "",
  shown = true,
  as: Tag = "div",
}: {
  children?: React.ReactNode;
  index?: number;
  from?: "left" | "right" | "up";
  className?: string;
  shown?: boolean;
  as?: any;
}) {
  const offset = from === "left" ? -50 : from === "right" ? 50 : 14;
  return (
    <Tag
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translate3d(${offset === 14 ? 0 : offset}px, ${offset === 14 ? offset : 0}px, 0)`,
        transition: `all 0.4s ${EASE} calc(0.5s + ${index} * 0.04s)`,
      }}
    >
      {children}
    </Tag>
  );
}

/** Their header treatment: transform on a 0.5s overshoot. */
export function Overshoot({
  children,
  className = "",
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{ transition: `transform 0.5s ${EASE_BACK}`, ...style }}
    >
      {children}
    </div>
  );
}

/** Exported so faces can reuse the timing functions directly. */
export const mbEase = EASE;
export const mbEaseBack = EASE_BACK;
