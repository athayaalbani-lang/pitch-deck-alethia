import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  motionValue,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

/* Shared motion vocabulary for the deck. Everything here is decorative: it
   never changes what a slide says, only how it arrives and how it responds. */

/* The reference site's one transition curve: 150ms on cubic-bezier(.23,1,.32,1).
   Content reveals are slower than its UI states, but they ride the same curve so
   the whole deck settles the same way. Mirrored as --rw-ease / --rw-dur-fast. */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/* ------------------------------------------------------------------ *
 * Pointer parallax — one window listener feeding shared motion values
 *
 * `motionValue()` is a factory, not a hook, so the values can live at module
 * scope and a single passive listener serves every sprite on the page.
 * ------------------------------------------------------------------ */

const springParallax = { stiffness: 60, damping: 18, mass: 0.7 };

const originX = motionValue(0);
const originY = motionValue(0);
let listening = false;

function watchPointer() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener(
    "pointermove",
    (event) => {
      originX.set(event.clientX / window.innerWidth - 0.5);
      originY.set(event.clientY / window.innerHeight - 0.5);
    },
    { passive: true }
  );
}

/* ------------------------------------------------------------------ *
 * Reveal — in-view entrance, optionally staggered by index
 * ------------------------------------------------------------------ */

const TAGS = {
  div: motion.div,
  article: motion.article,
  section: motion.section,
  li: motion.li,
  ol: motion.ol,
  ul: motion.ul,
  span: motion.span,
  header: motion.header,
  footer: motion.footer,
  dl: motion.dl,
  figure: motion.figure,
} as const;

export function Reveal({
  children,
  as = "div",
  className,
  index = 0,
  step = 0.06,
  y = 16,
  blur = 5,
  duration = 0.62,
  ...rest
}: {
  children: React.ReactNode;
  as?: keyof typeof TAGS;
  className?: string;
  /** Position in a group; multiplied by `step` to derive the delay. */
  index?: number;
  step?: number;
  y?: number;
  blur?: number;
  duration?: number;
} & Record<string, unknown>) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const Comp = TAGS[as];

  return (
    <Comp
      {...rest}
      ref={ref as never}
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration, delay: index * step, ease: EASE_OUT }}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ *
 * Tilt — pointer-driven 3D tilt with a travelling glare
 * ------------------------------------------------------------------ */

export function Tilt({
  children,
  className,
  /** Peak rotation in degrees. */
  max = 6,
  lift = 10,
  glare = true,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  /** Pixels the card lifts toward the viewer on hover. */
  lift?: number;
  glare?: boolean;
  as?: keyof typeof TAGS;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  // Pointer position inside the element, 0..1.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 190, damping: 20, mass: 0.6 };

  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);

  // The lift is a plain motion value so it lives in `style` alongside the
  // tilts — motion forbids splitting transform channels across style/animate.
  const liftTarget = useMotionValue(0);
  const translateZ = useSpring(liftTarget, spring);
  useEffect(() => {
    liftTarget.set(hover ? lift : 0);
  }, [hover, lift, liftTarget]);

  const glareX = useTransform(px, (value) => `${value * 100}%`);
  const glareY = useTransform(py, (value) => `${value * 100}%`);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(420px circle at ${x} ${y}, rgba(166,232,107,.16), transparent 62%)`
  );

  function track(event: React.PointerEvent<HTMLElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - box.left) / box.width);
    py.set((event.clientY - box.top) / box.height);
  }

  const Comp = TAGS[as];

  return (
    <Comp
      ref={ref as never}
      className={className}
      onPointerMove={track}
      onPointerEnter={() => {
        setHover(true);
        px.set(0.5);
        py.set(0.5);
      }}
      onPointerLeave={() => setHover(false)}
      style={{
        rotateX,
        rotateY,
        translateZ,
        transformStyle: "preserve-3d",
        willChange: hover ? "transform" : undefined,
      }}
    >
      {children}
      {glare ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
          style={{ background: glareBackground, opacity: hover ? 1 : 0, zIndex: 5 }}
        />
      ) : null}
    </Comp>
  );
}

/* ------------------------------------------------------------------ *
 * Sprite3D — a media asset given depth: pointer parallax, idle float,
 * a soft contact glow, and a slow turn.
 * ------------------------------------------------------------------ */

export function Sprite3D({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  /** Pixels of travel at the far edge of the viewport. */
  depth = 18,
  /** Idle bob amplitude in pixels. */
  float = 7,
  /** Idle sway in degrees. */
  sway = 4,
  glow = "#a6e86b",
  spin = false,
  delay = 0,
}: {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  depth?: number;
  float?: number;
  sway?: number;
  glow?: string;
  spin?: boolean;
  delay?: number;
}) {
  watchPointer();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const px = useSpring(useTransform(originX, (value) => value * depth), springParallax);
  const py = useSpring(useTransform(originY, (value) => value * depth * 0.6), springParallax);
  const rotateY = useSpring(useTransform(originX, (value) => value * sway * 2), springParallax);
  const rotateX = useSpring(useTransform(originY, (value) => -value * sway), springParallax);

  return (
    <div
      ref={ref}
      className={`relative flex items-center justify-center ${className}`}
      style={{ perspective: 900 }}
    >
      {/* Contact glow — reads as the sprite sitting in a pool of light. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 h-[26%] w-[74%] -translate-x-1/2 rounded-[50%] blur-xl"
        style={{
          bottom: "-6%",
          background: `radial-gradient(ellipse, ${glow}44, transparent 70%)`,
        }}
        animate={inView ? { opacity: [0.35, 0.7, 0.35], scaleX: [0.92, 1.04, 0.92] } : {}}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay }}
      />

      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: EASE_OUT }}
      >
        {/* Both wrappers need a definite height: the `h-full` on the <img>
            resolves against the nearest sized ancestor. With `w-full` alone
            the height is `auto`, so a wide source image renders at its
            intrinsic aspect and overflows (and gets clipped by) the pane. */}
        <motion.div
          className="h-full w-full"
          style={{ x: px, y: py, rotateX, rotateY }}
          animate={inView ? { translateY: [0, -float, 0] } : {}}
          transition={{
            duration: spin ? 5.4 : 4.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        >
          <img
            alt={alt}
            aria-hidden={alt ? undefined : true}
            className={`block h-full w-full select-none object-contain ${imgClassName}`}
            draggable={false}
            src={src}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Counter — a figure that counts up when it arrives
 *
 * The number is animated as a plain integer and then re-formatted to match the
 * original string exactly, so `"Rp 9,1 T"` still reads `Rp 9,1 T` at rest.
 * Separators keep their original positions: the running value is zero-padded
 * to the target's digit count before separators are re-inserted, which gives
 * an odometer effect instead of a width that jumps around.
 * ------------------------------------------------------------------ */

function splitFigure(text: string) {
  const match = /[0-9][0-9.,]*/.exec(text);
  if (!match) return null;
  const raw = match[0];
  const digits = raw.replace(/[.,]/g, "");
  return { raw, digits, prefix: text.slice(0, match.index), suffix: text.slice(match.index + raw.length) };
}

export function Counter({
  text,
  className,
  delay = 0,
  duration = 1.5,
  contentKey,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  /** Preserved so the editor can still locate this figure in the content JSON. */
  contentKey?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const parts = useMemo(() => splitFigure(text), [text]);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView || !parts) return;
    const target = Number(parts.digits);
    if (!Number.isFinite(target)) return;
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => setShown(value),
    });
    return () => controls.stop();
  }, [inView, parts, delay, duration]);

  if (!parts) return <span className={className}>{text}</span>;

  const width = parts.digits.length;
  const padded = String(Math.round(shown)).padStart(width, "0").slice(-width);

  // Walk the source string: separators are copied verbatim, digits are taken
  // from the running value. This keeps "9,1" and "53.928" in their own format.
  let formatted = "";
  let digitIndex = 0;
  for (let i = 0; i < parts.raw.length; i += 1) {
    const ch = parts.raw[i];
    if (ch === "." || ch === ",") formatted += ch;
    else {
      formatted += padded[digitIndex] ?? "0";
      digitIndex += 1;
    }
  }

  return (
    <span className={className} data-content-keys={contentKey} ref={ref}>
      {parts.prefix}
      {formatted}
      {parts.suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * ScanBar — a shimmer that travels along an empty track. Used where a
 * value is deliberately unknown, so no width is implied.
 * ------------------------------------------------------------------ */

export function ScanBar({
  className = "",
  tone = "#a6e86b",
  delay = 0,
  duration = 2.8,
}: {
  className?: string;
  tone?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-0 w-1/3"
        style={{
          background: `linear-gradient(90deg, transparent, ${tone}66, transparent)`,
        }}
        initial={{ x: "-120%" }}
        animate={{ x: "420%" }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut", delay, repeatDelay: 1.4 }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Glint — a diagonal highlight that crosses a surface once it arrives
 * ------------------------------------------------------------------ */

export function Glint({ className = "", delay = 0.4, duration = 1.1 }: { className?: string; delay?: number; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.span
        className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(230,237,244,.09), transparent)",
        }}
        initial={{ x: "0%", opacity: 0 }}
        animate={inView ? { x: "460%", opacity: [0, 1, 0] } : {}}
        transition={{ duration, delay, ease: "easeOut" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * PulseRing — a breathing halo for status markers
 * ------------------------------------------------------------------ */

export function PulseRing({ className = "", tone = "#a6e86b", delay = 0 }: { className?: string; tone?: string; delay?: number }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 rounded-full ${className}`}>
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ border: `1px solid ${tone}` }}
        animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay }}
      />
    </span>
  );
}
