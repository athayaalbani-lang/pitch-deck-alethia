import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Float, Pulse } from "@/components/ui/madbox";

/**
 * The 3D pixel-art pieces: the operator head and the streak shard.
 *
 * Artwork lives at `public/media/PixelHead.png` and `public/media/Diamond.png`.
 * Both fall back to a labelled placeholder if the file is absent, so a missing
 * asset leaves a deliberate-looking gap rather than a broken image icon.
 *
 * Motion is layered rather than animated in one place: `Float` carries the slow
 * vertical drift, `Pulse` the 6s scale, and a pointer-driven spring tilts the
 * piece in real 3D on its own Z plane.
 */

/**
 * Shared pointer tilt.
 *
 * These must be MotionValues, not React state — `useTransform` calls `.get()`
 * on whatever it is handed, and a plain number has no `.get()`, which throws and
 * takes the whole slide down with it.
 */
function useTilt(strength: number) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [strength, -strength]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(
    useTransform(px, [-0.5, 0.5], [-strength * 1.2, strength * 1.2]),
    { stiffness: 120, damping: 18 },
  );

  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return { rotateX, rotateY, track, reset };
}

/** Placeholder for artwork that has not been dropped in yet. */
function Missing({ size, label }: { size: number; label: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center border"
      style={{ borderColor: "var(--hairline)", background: "var(--ink-1)" }}
    >
      <span
        className="font-pixel uppercase"
        style={{ fontSize: size * 0.09, color: "var(--steel)" }}
      >
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * PixelSpin — a full 360-degree turntable on a flat bitmap.
 *
 * A single face spun around Y goes edge-on at 90 degrees and disappears for a
 * quarter of every cycle. Rendering the sprite on both sides of a thin slab
 * fixes that: front face covers 0-90 and 270-360, back face covers 90-270, so
 * the sprite is readable the whole way round and the edge-on moment is a quick
 * flip rather than a hole. `backface-visibility: hidden` stops the two faces
 * double-drawing into each other.
 * ------------------------------------------------------------------ */

export function PixelSpin({
  src,
  size = 96,
  duration = 9,
  accent = "var(--cyan)",
  glow = true,
  alt = "",
}: {
  src: string;
  size?: number;
  /** Seconds per revolution. */
  duration?: number;
  accent?: string;
  glow?: boolean;
  alt?: string;
}) {
  const sprite = (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className="block h-full w-full select-none object-contain"
      style={{
        imageRendering: "pixelated",
        filter: glow
          ? `drop-shadow(0 0 14px ${accent}66) drop-shadow(0 10px 18px rgba(0,0,0,0.6))`
          : "drop-shadow(0 10px 18px rgba(0,0,0,0.6))",
      }}
    />
  );

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size, perspective: 900 }}
    >
      {/* Bloom sitting behind the slab, so the glow does not turn with it. */}
      {glow && (
        <span
          className="pointer-events-none absolute inset-[-14%] rounded-[50%]"
          style={{
            background: `radial-gradient(circle, ${accent}40, transparent 66%)`,
            filter: "blur(7px)",
          }}
          aria-hidden="true"
        />
      )}

      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", transform: "translateZ(14px)" }}
        >
          {sprite}
        </div>
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(14px)",
          }}
        >
          {sprite}
        </div>
      </motion.div>
    </div>
  );
}

/* The rank ladder, as three turning sprites. Durations are deliberately
   incommensurate so they never line up into a single pulsing beat. */
const RANK_SPRITES = [
  { src: "/media/levelone.png", alt: "Rank one" },
  { src: "/media/leveltwo.png", alt: "Rank two" },
  { src: "/media/levelthree.png", alt: "Rank three" },
];

export function LevelSprites({
  size = 80,
  gap = 14,
  accent = "var(--cyan)",
}: {
  size?: number;
  gap?: number;
  accent?: string;
}) {
  return (
    <div className="flex items-center" style={{ gap }}>
      {RANK_SPRITES.map((s, i) => (
        <Float key={s.src} index={i}>
          <PixelSpin
            src={s.src}
            size={size}
            duration={9 + i * 2.3}
            accent={accent}
            alt={s.alt}
          />
        </Float>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Pixel head — the operator avatar.
 * ------------------------------------------------------------------ */

export function PixelHead({
  size = 120,
  accent = "var(--cyan)",
  interactive = true,
  /** Degrees the reticle travels per cycle. */
  spin = 260,
}: {
  /** Box size in artboard pixels. */
  size?: number;
  accent?: string;
  interactive?: boolean;
  spin?: number;
}) {
  const [missing, setMissing] = useState(false);
  const { rotateX, rotateY, track, reset } = useTilt(interactive ? 11 : 0);
  const r = Math.round(size * 0.42);

  return (
    <div
      className="relative shrink-0 grid place-items-center"
      style={{ width: size, height: size, perspective: 1100 }}
      onPointerMove={interactive ? track : undefined}
      onPointerLeave={interactive ? reset : undefined}
    >
      {/* The 260-degree rotation lives on the reticle, not on the artwork.
          PixelHead.png is a flat bitmap: spinning it around Y thins it to
          nothing at 90 degrees and it disappears for half the cycle. A ring and
          four brackets stay readable at every angle, and it matches the framing
          the real profile page uses around the avatar. */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ width: size, height: size }}
        animate={{ rotate: spin }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" width={size} height={size} fill="none">
          {/* dashed orbit */}
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke={accent}
            strokeWidth="0.5"
            strokeDasharray="3 6"
            opacity="0.4"
          />
          {/* corner brackets */}
          {[
            [4, 4, 1, 1],
            [96, 4, -1, 1],
            [4, 96, 1, -1],
            [96, 96, -1, -1],
          ].map(([x, y, sx, sy], i) => (
            <path
              key={i}
              d={`M ${x + sx * 12} ${y} L ${x} ${y} L ${x} ${y + sy * 12}`}
              stroke={accent}
              strokeWidth="2"
              opacity="0.85"
            />
          ))}
        </svg>
      </motion.div>

      <Float index={1}>
        <Pulse index={0}>
          <motion.div
            className="relative"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            {missing ? (
              <div style={{ width: r * 2, height: r * 2 }}>
                <Missing size={r * 2} label="no_avatar" />
              </div>
            ) : (
              /* Same double-sided slab as PixelSpin, so the avatar turns a
                 full 360 and still reads as artwork at every angle. */
              <motion.div
                className="relative"
                style={{ width: r * 2, height: r * 2, transformStyle: "preserve-3d" }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                {[
                  "translateZ(16px)",
                  "rotateY(180deg) translateZ(16px)",
                ].map((t) => (
                  <div
                    key={t}
                    className="absolute inset-0"
                    style={{ backfaceVisibility: "hidden", transform: t }}
                  >
                    <img
                      src="/media/PixelHead.png"
                      alt="Operator avatar"
                      draggable={false}
                      onError={() => setMissing(true)}
                      className="block h-full w-full select-none object-contain"
                      style={{
                        filter:
                          "drop-shadow(0 0 16px rgba(166,232,107,0.4)) drop-shadow(0 16px 30px rgba(0,0,0,0.62))",
                        imageRendering: "pixelated",
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {/* Scan line sweeping the face plate — what makes it read as a live
                feed instead of a sticker. */}
            {!missing && (
              <span
                className="mb-scan pointer-events-none absolute inset-x-[16%] h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                  boxShadow: `0 0 12px ${accent}`,
                }}
                aria-hidden="true"
              />
            )}
          </motion.div>
        </Pulse>
      </Float>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Pixel shard — the streak marker on the dashboard.
 * ------------------------------------------------------------------ */

export function PixelShard({
  size = 96,
  accent = "var(--cyan)",
  interactive = true,
  /** Peak rotation of the idle turntable, in degrees. */
  spin = 260,
}: {
  size?: number;
  accent?: string;
  interactive?: boolean;
  spin?: number;
}) {
  const [missing, setMissing] = useState(false);
  /* Wider swing than the head: the shard is a tall thin object, so tilting it
     far reads as a solid rotating volume rather than a flat card. */
  const { rotateX, rotateY, track, reset } = useTilt(interactive ? 16 : 0);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size * 0.62, height: size, perspective: 1100 }}
      onPointerMove={interactive ? track : undefined}
      onPointerLeave={interactive ? reset : undefined}
    >
      {/* Same reasoning as the head: the sweep belongs on a reticle, because the
          bitmap goes edge-on and vanishes halfway through a Y-spin. */}
      <motion.svg
        className="pointer-events-none absolute"
        viewBox="0 0 100 160"
        width={size * 0.62}
        height={size}
        fill="none"
        animate={{ rotate: spin }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      >
        <ellipse
          cx="50"
          cy="80"
          rx="47"
          ry="75"
          stroke={accent}
          strokeWidth="0.7"
          strokeDasharray="3 7"
          opacity="0.35"
        />
      </motion.svg>

      <Float index={2}>
        <Pulse index={1}>
          <motion.div
            className="relative"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            {missing ? (
              <Missing size={size} label="no_shard" />
            ) : (
              <img
                src="/media/Diamond.png"
                alt=""
                draggable={false}
                onError={() => setMissing(true)}
                className="block select-none object-contain"
                style={{
                  width: size * 0.62,
                  height: size,
                  filter: `drop-shadow(0 14px 24px rgba(0,0,0,0.62)) drop-shadow(0 0 20px ${accent}55)`,
                  imageRendering: "pixelated",
                }}
              />
            )}

            {/* Halo behind the shard, standing in for a rim light. */}
            {!missing && (
              <span
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
                style={{
                  width: "130%",
                  height: "46%",
                  background: `radial-gradient(ellipse, ${accent}2E, transparent 70%)`,
                  filter: "blur(4px)",
                  transform: "translateZ(-24px)",
                }}
                aria-hidden="true"
              />
            )}
          </motion.div>
        </Pulse>
      </Float>
    </div>
  );
}
