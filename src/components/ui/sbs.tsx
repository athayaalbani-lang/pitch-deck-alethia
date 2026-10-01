import React from "react";
import { motion } from "motion/react";

/**
 * Visual language lifted from the SBS Town 3D map, re-expressed in Alethia's
 * lime-on-navy palette.
 *
 * Note on fidelity: the reference has ZERO CSS animations — its motion is a
 * real-time WebGL city rendered to a single <canvas>. None of that is
 * liftable. What lives here is the 2D half of the language: the floating
 * gradient capsule, its hover drift, the dark round control, the neon glow
 * and the bokeh depth layer. The accent stays lime so the product identity
 * survives the translation.
 */

/* The reference capsule runs a pink→orange ramp. We keep the same shape,
   hue travel and gloss, rotated onto the lime ramp instead. */
const CAPSULE_RAMP =
  "var(--spectrum)";

/* ------------------------------------------------------------------ *
 * Capsule — the floating hotspot marker.
 * ------------------------------------------------------------------ */
export function Capsule({
  children,
  size = "md",
  tilt = 0,
  glow = true,
  onClick,
  className = "",
  dimmed = false,
  align = "center",
}: {
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** Degrees of lean, mirroring the slightly rotated pills in the reference. */
  tilt?: number;
  glow?: boolean;
  onClick?: () => void;
  className?: string;
  dimmed?: boolean;
  align?: "center" | "left";
}) {
  // The artboard is a fixed 1920px canvas scaled to roughly a third on screen,
  // so these sizes are artboard pixels and need to read large.
  const pad =
    size === "lg"
      ? "px-12 py-6"
      : size === "sm"
        ? "px-6 py-2.5"
        : "px-9 py-4";
  const text =
    size === "lg"
      ? "text-[34px]"
      : size === "sm"
        ? "text-[19px]"
        : "text-[26px]";

  const Comp = onClick ? motion.button : motion.div;

  return (
    <Comp
      onClick={onClick}
      type={onClick ? "button" : undefined}
      // Idle drift so the marker reads as floating in 3D space.
      animate={
        dimmed
          ? { y: 0, opacity: 0.42 }
          : { y: [0, -5, 0], rotate: tilt }
      }
      transition={
        dimmed
          ? { duration: 0.3 }
          : {
              y: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 0 },
            }
      }
      className={`relative inline-flex items-center rounded-full font-grotesk font-bold tracking-tight whitespace-nowrap ${pad} ${text} ${align === "left" ? "justify-start" : "justify-center"} ${className}`}
      style={{
        background: CAPSULE_RAMP,
        color: "var(--ink-0)",
        transform: `rotate(${tilt}deg)`,
        boxShadow: glow
          ? "0 10px 34px -8px rgba(166,232,107,0.55), inset 0 1px 0 rgba(255,255,255,0.45)"
          : undefined,
      }}
    >
      {/* gloss sheen along the top edge, as on the reference capsules */}
      <span
        className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-full opacity-30"
        style={{ background: "linear-gradient(to bottom, #fff, transparent)" }}
        aria-hidden="true"
      />
      <span className="relative">{children}</span>
    </Comp>
  );
}

/* ------------------------------------------------------------------ *
 * RoundControl — the dark circular buttons in the reference corners.
 * ------------------------------------------------------------------ */
export function RoundControl({
  children,
  label,
  onClick,
  size = 88,
  active = false,
  className = "",
}: {
  children?: React.ReactNode;
  label: string;
  onClick?: () => void;
  size?: number;
  active?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`relative flex flex-col items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: "var(--ink-1)",
        boxShadow: active
          ? "0 0 0 1.5px var(--cyan), 0 12px 40px -10px rgba(166,232,107,0.5)"
          : "0 0 0 1px rgba(255,255,255,0.10), 0 18px 50px -14px rgba(0,0,0,0.9)",
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.34, 1.4, 0.64, 1] }}
    >
      <span className="relative z-10 flex flex-col items-center gap-1">
        {children}
        {label && (
          <span className="u8-overline text-[var(--cyan)]">{label}</span>
        )}
      </span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ *
 * Bokeh — the out-of-focus light motes drifting over the scene.
 * ------------------------------------------------------------------ */
export function Bokeh({
  count = 16,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  // Deterministic pseudo-random so SSR and client agree on the layout.
  const motes = Array.from({ length: count }, (_, i) => {
    const a = (i * 2654435761) % 1000 / 1000;
    const b = (i * 40503 + 7919) % 1000 / 1000;
    const c = (i * 2246822519) % 1000 / 1000;
    return {
      left: `${a * 100}%`,
      top: `${b * 100}%`,
      size: 3 + c * 11,
      dur: 9 + c * 14,
      delay: a * 8,
      drift: 20 + c * 46,
    };
  });

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {motes.map((m, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: m.left,
            top: m.top,
            width: m.size * 2.2,
            height: m.size * 2.2,
            background: "radial-gradient(circle, rgba(214,245,183,0.75), transparent 70%)",
            filter: "blur(2px)",
          }}
          animate={{
            y: [0, -m.drift, 0],
            opacity: [0.18, 0.6, 0.18],
          }}
          transition={{
            duration: m.dur,
            delay: m.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * NeonFrame — rim light in the lime ramp, standing in for the neon
 * edge lighting on the reference geometry.
 * ------------------------------------------------------------------ */
export function NeonFrame({
  children,
  color = "var(--cyan)",
  intensity = 0.4,
  className = "",
}: {
  children?: React.ReactNode;
  color?: string;
  intensity?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} ${intensity * 100}%, transparent), 0 0 44px -12px color-mix(in srgb, ${color} 40%, transparent)`,
      }}
    >
      {children}
    </div>
  );
}
