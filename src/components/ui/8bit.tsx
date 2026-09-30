import React from "react";

/**
 * Design primitives adapted from the 8bit.ai reference site.
 *
 * Nothing here carries pitch content — these are purely presentational
 * building blocks so every face speaks the same visual language.
 */

/* ------------------------------------------------------------------ *
 * Ring — their signature motion motif.
 * Source: <circle cx="50" cy="50" r="20" stroke-width="0.2" /> inside a
 * 25..75 viewBox, spun with `animate-spin`.
 * ------------------------------------------------------------------ */
export function Ring({
  size = 120,
  thickness = 0.2,
  className = "",
  color = "var(--cyan)",
  opacity = 1,
  slow = false,
}: {
  /** Outer box size in artboard pixels. */
  size?: number;
  /** Stroke weight in viewBox units — 0.2 reads as a hairline. */
  thickness?: number;
  className?: string;
  color?: string;
  opacity?: number;
  /** Use the slow ambient rotation instead of the 1.6s spinner. */
  slow?: boolean;
}) {
  return (
    <span
      className={`block ${slow ? "u8-ring-slow" : "u8-ring"} ${className}`}
      style={{ width: size, height: size, opacity }}
      aria-hidden="true"
    >
      <svg viewBox="25 25 50 50" width={size} height={size} fill="none">
        <circle
          cx="50"
          cy="50"
          r="20"
          stroke={color}
          strokeWidth={thickness}
          strokeMiterlimit="10"
        />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * HexFrame — the elongated hexagon from their `shape-outline` symbol.
 * Used as a structural frame for hero content.
 * ------------------------------------------------------------------ */
export function HexFrame({
  children,
  className = "",
  stroke = true,
  strokeColor = "var(--cyan)",
}: {
  children?: React.ReactNode;
  className?: string;
  stroke?: boolean;
  strokeColor?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {stroke && (
        <div
          className="u8-hex pointer-events-none absolute inset-0"
          style={{ border: `1px solid ${strokeColor}`, opacity: 0.32 }}
          aria-hidden="true"
        />
      )}
      <div className="u8-hex relative h-full w-full">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Vignette — the 45deg black wash they lay over the whole viewport.
 * ------------------------------------------------------------------ */
export function Vignette({ className = "" }: { className?: string }) {
  return (
    <div
      className={`u8-vignette pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ *
 * Overline — the small label that sits above every section title.
 * ------------------------------------------------------------------ */
export function Overline({
  children,
  className = "",
  color = "var(--cyan)",
}: {
  children?: React.ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <span className={`u8-overline ${className}`} style={{ color }}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Reveal — mask reveal. The child slides up out of an overflow-hidden
 * box, mirroring how their header and logo animate in.
 * ------------------------------------------------------------------ */
export function Reveal({
  children,
  shown,
  delay = 0,
  className = "",
}: {
  children?: React.ReactNode;
  shown: boolean;
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`u8-mask ${className}`} data-shown={shown ? "true" : "false"}>
      <span style={{ transitionDelay: `${delay}ms` }}>{children}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Hairline — a 1px rule standing in for a boxed container edge.
 * ------------------------------------------------------------------ */
export function Hairline({
  className = "",
  color,
}: {
  className?: string;
  color?: string;
}) {
  return (
    <span
      className={`u8-hairline block ${className}`}
      style={color ? { background: color } : undefined}
      aria-hidden="true"
    />
  );
}
