import React from "react";
import { motion } from "motion/react";
import { Pulse } from "@/components/ui/madbox";

/**
 * Floating islands, in the manner of the CN Revolutioner reference: separate
 * landmasses suspended over open water, each bobbing on its own offset, with
 * visible gaps of "sea" between them rather than one continuous ground.
 *
 * The landmass is drawn with a clip-path — wide rounded crown tapering to a
 * narrow keel — so the underside reads as a hanging island.
 */

type Island = {
  /** Inline rig sitting on the crown. */
  src: string;
  /** Plaque under the island. */
  caption: string;
  /** Bob phase offset, in seconds. */
  phase: number;
  /** Vertical placement as a percentage of the scene height. */
  top: string;
  /** Horizontal placement as a percentage of the scene width. */
  left: string;
  /** Crown width as a percentage of the scene width. */
  width: string;
  scale: number;
  tone: string;
};

const ISLANDS: Island[] = [
  {
    src: "/media/rig-server.svg",
    caption: "Server",
    phase: 0,
    top: "8%",
    left: "4%",
    width: "30%",
    scale: 0.52,
    tone: "#5E8F2E",
  },
  {
    src: "/media/rig-lens.svg",
    caption: "Lens",
    phase: 1.1,
    top: "34%",
    left: "38%",
    width: "27%",
    scale: 0.44,
    tone: "#7ED957",
  },
  {
    src: "/media/rig-computer.svg",
    caption: "Desktop",
    phase: 2.2,
    top: "62%",
    left: "69%",
    width: "28%",
    scale: 0.4,
    tone: "#A6E86B",
  },
];

/* Wide scalloped crown, pinched to a keel at the bottom. */
const ISLAND_SHAPE =
  "polygon(6% 0%, 30% 3%, 50% 0%, 70% 3%, 94% 0%, 100% 26%, 93% 44%, 78% 56%, 66% 72%, 54% 88%, 50% 100%, 46% 88%, 34% 72%, 22% 56%, 7% 44%, 0% 26%)";

export function FloatingIslands({
  labels,
  className = "",
}: {
  /** Optional overrides for the three plaques. */
  labels?: [string, string, string];
  className?: string;
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* Open water below and between the islands. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 118%, rgba(166,232,107,0.10), transparent 58%)",
        }}
        aria-hidden="true"
      />

      {ISLANDS.map((isle, i) => (
        <Island
          key={isle.src}
          island={isle}
          index={i}
          caption={labels?.[i] ?? isle.caption}
        />
      ))}
    </div>
  );
}

function Island({
  island,
  index,
  caption,
}: {
  island: Island;
  index: number;
  caption: string;
}) {
  return (
    <motion.div
      className="absolute"
      style={{ top: island.top, left: island.left, width: island.width }}
      /* Each island rides its own cycle, offset by phase. */
      animate={{ y: [0, -12, 0], rotate: [0, index % 2 ? 0.5 : -0.5, 0] }}
      transition={{
        duration: 7 + index * 0.7,
        repeat: Infinity,
        ease: [0.215, 0.61, 0.355, 1],
        delay: -island.phase,
      }}
    >
      {/* Rig standing on the crown. */}
      <div className="relative flex justify-center">
        <img
          src={island.src}
          alt={caption}
          className="w-full select-none"
          draggable={false}
          style={{
            display: "block",
            filter: "drop-shadow(0 14px 26px rgba(0,0,0,0.55))",
          }}
        />
      </div>

      {/* The landmass itself. */}
      <div
        className="relative -mt-[6%]"
        style={{ aspectRatio: "1.55 / 1" }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            clipPath: ISLAND_SHAPE,
            background: `linear-gradient(178deg, ${island.tone} 0%, #24401A 46%, #101A0C 100%)`,
          }}
        />
        {/* Lit crown edge, catching the key light. */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: ISLAND_SHAPE,
            background: `linear-gradient(178deg, rgba(226,255,196,0.55) 0%, transparent 34%)`,
          }}
        />
        {/* Contact shadow cast down onto nothing. */}
        <div
          className="absolute left-1/2 top-[104%] -translate-x-1/2 rounded-[50%]"
          style={{
            width: "62%",
            height: 16,
            background: "radial-gradient(ellipse, rgba(0,0,0,0.7), transparent 72%)",
            filter: "blur(5px)",
          }}
        />
      </div>

      {/* Plaque hanging beneath the keel. */}
      <div className="mt-2 flex justify-center">
        <Pulse index={index}>
          <span
            className="inline-block rounded-full px-3 @xl:px-6 py-1 @xl:py-2 font-grotesk font-bold text-[9px] @xl:text-[16px] whitespace-nowrap"
            style={{
              background:
                "linear-gradient(100deg, #5E8F2E 0%, #7ED957 34%, #A6E86B 58%, #D8F58F 100%)",
              color: "var(--ink-0)",
              boxShadow:
                "0 8px 26px -8px rgba(166,232,107,0.5), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            {caption}
          </span>
        </Pulse>
      </div>
    </motion.div>
  );
}
