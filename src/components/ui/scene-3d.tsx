import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Float, Pulse } from "@/components/ui/madbox";

/**
 * A real CSS-3D stage for the Alethia deck.
 *
 * The reference rigs are animated SVGs, so they are placed on separate Z
 * planes inside a perspective container. Pointer position rotates the whole
 * stage and parallaxes each plane by its depth, which reads as genuine
 * volume without pulling in a WebGL runtime.
 */

type Rig = {
  src: string;
  label: string;
  /** Depth in px. Larger = further back = slower parallax. */
  z: number;
  x: string;
  y: string;
  scale: number;
};

const RIGS: Rig[] = [
  { src: "/media/rig-server.svg", label: "Server", z: -260, x: "6%", y: "4%", scale: 0.62 },
  { src: "/media/rig-lens.svg", label: "Lens", z: -90, x: "46%", y: "26%", scale: 0.78 },
  { src: "/media/rig-computer.svg", label: "Desktop", z: 70, x: "16%", y: "56%", scale: 0.92 },
];

export function Scene3D({
  adminLabel,
  className = "",
}: {
  adminLabel: string;
  className?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);

  // Normalised pointer offset, -0.5..0.5 on each axis.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 });

  // Whole-stage tilt: a few degrees is enough to sell the depth.
  const rotateY = useTransform(sx, [-0.5, 0.5], [7, -7]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      ref={stageRef}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ perspective: "1400px" }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Floor grid, laid flat on the XZ plane. */}
        <div
          className="absolute left-[-20%] right-[-20%] bottom-[-30%] h-[70%] pointer-events-none"
          style={{
            transform: "rotateX(72deg)",
            transformOrigin: "50% 0%",
            backgroundImage:
              "linear-gradient(to right, rgba(166,232,107,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(166,232,107,0.16) 1px, transparent 1px)",
            backgroundSize: "90px 90px",
            maskImage:
              "linear-gradient(to bottom, transparent, #000 22%, #000 62%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, #000 22%, #000 62%, transparent)",
          }}
          aria-hidden="true"
        />

        {RIGS.map((rig, i) => (
          <RigPlane key={rig.src} rig={rig} index={i} sx={sx} sy={sy} adminLabel={i === 2 ? adminLabel : undefined} />
        ))}

        {/* Admin node floating highest, closest to camera. */}
        <motion.div
          className="absolute"
          style={{
            left: "62%",
            top: "6%",
            translateZ: "190px",
            x: useTransform(sx, [-0.5, 0.5], [26, -26]),
            y: useTransform(sy, [-0.5, 0.5], [16, -16]),
          }}
        >
          <Float index={2}>
            <Pulse index={2}>
              <div
                className="px-4 py-2 rounded-full font-grotesk font-bold text-[11px] @xl:text-[17px] whitespace-nowrap"
                style={{
                  background:
                    "var(--spectrum)",
                  color: "var(--ink-0)",
                  boxShadow:
                    "0 10px 34px -8px rgba(166,232,107,0.55), inset 0 1px 0 rgba(255,255,255,0.45)",
                }}
              >
                {adminLabel}
              </div>
            </Pulse>
          </Float>
        </motion.div>
      </motion.div>
    </div>
  );
}

/** One rig on its own Z plane, parallaxing by its own depth factor. */
function RigPlane({
  rig,
  index,
  sx,
  sy,
  adminLabel,
}: {
  rig: Rig;
  index: number;
  sx: any;
  sy: any;
  adminLabel?: string;
}) {
  // Nearer planes swing further, so they read as closer to the viewer.
  const factor = rig.z === 0 ? 1 : 40 / Math.abs(rig.z + 200);

  return (
    <motion.div
      className="absolute"
      style={{
        left: rig.x,
        top: rig.y,
        translateZ: `${rig.z}px`,
        scale: rig.scale,
        x: useTransform(sx, [-0.5, 0.5], [26 * factor, -26 * factor]),
        y: useTransform(sy, [-0.5, 0.5], [16 * factor, -16 * factor]),
        transformStyle: "preserve-3d",
      }}
    >
      <Float index={index}>
        <div className="relative">
          <img
            src={rig.src}
            alt={rig.label}
            className="w-[340px] @xl:w-[620px] select-none"
            draggable={false}
            style={{ display: "block", filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.6))" }}
          />
          {/* Contact shadow anchoring the rig to the floor. */}
          <span
            className="absolute left-1/2 -bottom-6 -translate-x-1/2 rounded-[50%]"
            style={{
              width: "70%",
              height: 26,
              background:
                "radial-gradient(ellipse, rgba(0,0,0,0.75), transparent 70%)",
              filter: "blur(6px)",
            }}
            aria-hidden="true"
          />
          {adminLabel && null}
        </div>
      </Float>
    </motion.div>
  );
}
