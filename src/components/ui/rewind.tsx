import React from "react";
import { motion } from "motion/react";
import { PixelHead } from "@/components/ui/pixel-art";
import { TextContent } from "@/components/ui/text-content";

/**
 * Web Rewind design language.
 *
 * Everything here is presentational — no pitch content lives in this file.
 * The tokens (`--spectrum`, `--rewind-*`, `--rw-radius`) are declared in
 * index.css so faces and this file stay in sync.
 *
 * The reference's look in four moves: true black ground, Space Mono set in
 * uppercase with wide tracking, white hairline chrome rounded to ~10px, and
 * one five-stop spectrum ramp doing all the colour work.
 */

/* ------------------------------------------------------------------ *
 * OrbitField — the reference backdrop: faint concentric orbits, dashed
 * arcs and scattered stars over black.
 * ------------------------------------------------------------------ */
export function OrbitField({
  /** Dot density multiplier. */
  density = 26,
  className = "",
}: {
  density?: number;
  className?: string;
}) {
  // Deterministic pseudo-random so SSR and client agree on the star layout.
  const stars = Array.from({ length: density }, (_, i) => {
    const a = (i * 2654435761) % 1000 / 1000;
    const b = (i * 40503 + 7919) % 1000 / 1000;
    const c = (i * 2246822519) % 1000 / 1000;
    return {
      left: `${a * 100}%`,
      top: `${b * 100}%`,
      size: 1.5 + c * 3.5,
      opacity: 0.18 + c * 0.42,
    };
  });

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* concentric orbits */}
      <div className="rw-orbit absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.13]">
        <div className="h-[62vmin] w-[62vmin] rounded-full border border-dashed border-[#263544]" />
      </div>
      <div className="rw-orbit-reverse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]">
        <div className="h-[86vmin] w-[86vmin] rounded-full border border-[#263544]" />
      </div>

      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * PixelHero — the mascot as the scene's 3D subject.
 *
 * Wraps the existing `PixelHead` (pointer tilt, orbiting reticle, float,
 * pulse) rather than reimplementing it, and adds the reference's glow and
 * framing around the sprite.
 * ------------------------------------------------------------------ */
export function PixelHero({
  size = 520,
  interactive = true,
  /** Accent for the reticle. Defaults to the brand purple. */
  accent = "var(--cyan-bright)",
  spin = 300,
  className = "",
}: {
  /** Artboard pixels — the head renders at ~84% of this. */
  size?: number;
  interactive?: boolean;
  accent?: string;
  spin?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative grid place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Purple bloom behind the sprite, standing in for the reference's
          lit 3D object sitting in a black void. */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          background:
            "radial-gradient(circle, rgba(166,232,107,0.34) 0%, rgba(166,232,107,0.09) 46%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      {/* `turntable` off: the sprite is a flat bitmap, so a full 360° Y spin
          would show it edge-on for half the cycle. The ±26° sweep reads as 3D
          and never collapses. The PNG has its own corner brackets, so the SVG
          reticle is suppressed here. */}
      <PixelHead
        size={size}
        accent={accent}
        interactive={interactive}
        spin={spin}
        turntable={false}
        reticle={false}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * SpectrumRule — the gradient hairline the reference uses to underline and
 * to divide. Pass `vertical` for the bottom progress-meter treatment.
 * ------------------------------------------------------------------ */
export function SpectrumRule({
  className = "",
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  return (
    <span
      className={`block ${vertical ? "rw-spectrum-vert h-full" : "rw-spectrum h-[3px] w-full"} ${className}`}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ *
 * SpectrumBar — the reference's progress meter, tinted with the ramp.
 *
 * `share` (0–100) draws a filled portion against a dim track. Bar fills in
 * the deck's editorial slides should all carry the ramp rather than a flat
 * accent, so the slide reads as one gradient system end to end.
 * ------------------------------------------------------------------ */
export function SpectrumBar({
  share,
  className = "",
  barClassName = "",
}: {
  /** Filled percentage. Omit for a full-width bar. */
  share?: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <span className={`block w-full overflow-hidden rounded-full bg-white/12 ${className}`}>
      {share === undefined ? (
        <span className={`rw-spectrum block h-full w-full ${barClassName}`} />
      ) : (
        <motion.span
          className={`rw-spectrum block h-full rounded-full ${barClassName}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${share}%` }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
        />
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * RetroPanel — the rounded, white-outlined chrome box.
 * ------------------------------------------------------------------ */
export function RetroPanel({
  children,
  className = "",
  tone = "quiet",
}: {
  children?: React.ReactNode;
  className?: string;
  /** `quiet` = hairline, `solid` = full white outline, `bare` = no fill. */
  tone?: "quiet" | "solid" | "bare";
}) {
  const toneClass =
    tone === "solid" ? "rw-panel-solid" : tone === "bare" ? "border border-[#263544]/60 bg-transparent rounded-[var(--rw-radius)]" : "rw-panel";
  return <div className={`${toneClass} ${className}`}>{children}</div>;
}

/* ------------------------------------------------------------------ *
 * TerminalLabel — the small tracked uppercase label the reference sets in
 * Space Mono. `accent` colours the marker glyph.
 * ------------------------------------------------------------------ */
export function TerminalLabel({
  content,
  contentKey,
  accent = "var(--cyan-bright)",
  marker = "○",
  className = "",
}: {
  content: string;
  contentKey?: string;
  accent?: string;
  /** Leading glyph; pass an empty string to drop it. */
  marker?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {marker ? (
        <span aria-hidden="true" style={{ color: accent }}>
          {marker}
        </span>
      ) : null}
      <TextContent
        content={content}
        data-content-keys={contentKey}
        className="font-terminal text-[8px] uppercase tracking-[0.2em]"
      />
    </span>
  );
}