import React from "react";
import { motion } from "motion/react";

/**
 * The planet, turning clockwise on the spot.
 *
 * The rotation is about Z — the axis through the artwork's face — not Y. A flat
 * bitmap spun about Y collapses edge-on at 90° and, having only one face, reads
 * as a slit for a quarter of every revolution; the lettering baked into the art
 * ends up mirrored too. About Z the silhouette stays whole and the artwork turns
 * the way a coin on a table does.
 *
 * A shallow tilt rides on top so it still reads as a body in space rather than a
 * flat card, and it is nested inside the turntable so the two transforms compose
 * instead of overwriting each other.
 */
export function PlanetSpin({
  src,
  width,
  /** Seconds per revolution. Slow, so it reads as planetary drift. */
  duration = 60,
  className = "",
  style,
}: {
  src: string;
  /** Rendered width in artboard pixels. */
  width: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width, height: width * 0.82, perspective: 1400, ...style }}
    >
      <motion.div
        className="relative h-full w-full"
        /* Positive Z rotation is clockwise, matching the reference. */
        animate={{ rotate: 360 }}
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {/* The sway is nested inside the turntable so the two compose instead of
            overwriting each other. */}
        <motion.div
          className="h-full w-full"
          animate={{ rotateX: [3, -3, 3], rotateY: [-4, 4, -4] }}
          transition={{ duration: duration / 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            alt=""
            className="block h-full w-full select-none object-contain"
            draggable={false}
            src={src}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * The same turntable, but sized and framed as the hero subject rather than as a
 * detail.
 *
 * No tilt: the artwork is a disc ringed with debris, so tilting toward 90°
 * foreshortens the whole thing into an unreadable band. Turning on Z keeps the
 * silhouette circular at every angle while the debris orbits inside it, which is
 * what makes the motion read as a rotating body rather than a tumbling card.
 */
export function PlanetBody({
  src,
  width,
  duration = 90,
  className = "",
  style,
}: {
  src: string;
  width: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width, height: width * 0.82, perspective: 1600, ...style }}
    >
      <motion.div
        className="h-full w-full"
        animate={{ rotate: 360 }}
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="h-full w-full"
          animate={{ rotateX: [2, -2, 2], rotateY: [-3, 3, -3] }}
          transition={{ duration: duration / 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            alt=""
            className="block h-full w-full select-none object-contain"
            draggable={false}
            src={src}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}