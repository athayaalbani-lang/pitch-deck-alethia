import React from "react";
import { motion } from "motion/react";
import { TextContent } from "@/components/ui/text-content";

/**
 * The landing hero.
 *
 * Layout is deliberately identical to the original mock: the same staggered
 * positions, the same small markers, the same single-line chips and headline
 * treatment. Only the marker itself changed — the empty diamond placeholder
 * is now a rig standing on a small floating island.
 */

const ISLE_POS = [
  { left: "16%", top: "30%" },
  { left: "50%", top: "52%" },
  { left: "82%", top: "26%" },
];

/* Order matches the chip rows: server, desktop, lens. */
const RIGS = [
  { src: "/media/rig-server.svg", alt: "Server" },
  { src: "/media/rig-computer.svg", alt: "Desktop" },
  { src: "/media/rig-lens.svg", alt: "Lens" },
];

/* Wide scalloped crown tapering to a keel — a hanging island. */
const ISLAND_SHAPE =
  "polygon(9% 0%, 34% 5%, 50% 0%, 66% 5%, 91% 0%, 100% 32%, 91% 52%, 77% 64%, 65% 80%, 53% 93%, 50% 100%, 47% 93%, 35% 80%, 23% 64%, 9% 52%, 0% 32%)";

export function LandingMock({
  active,
  headline,
  cta,
  chips,
}: {
  active: boolean;
  headline: string;
  cta: string;
  chips: { label: string; value: string }[];
}) {
  return (
    <div
      className="relative w-full h-full bg-[var(--navy-0)] border border-[var(--line)] overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, #0C1928 1px, transparent 1px), linear-gradient(to bottom, #0C1928 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* isles */}
      {ISLE_POS.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-20 @xl:w-32"
          style={{ left: pos.left, top: pos.top }}
          initial={{ opacity: 0, y: 24 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 + i * 0.18 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: -i * 0.6,
            }}
          >
            {/* The rig standing on the crown. */}
            <img
              src={RIGS[i].src}
              alt={RIGS[i].alt}
              className="w-full select-none block"
              draggable={false}
              style={{
                filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.5))",
              }}
            />

            {/* The landmass under it. */}
            <div
              className="relative -mt-[8%]"
              style={{ aspectRatio: "1.9 / 1" }}
              aria-hidden="true"
            >
              <div
                className="absolute inset-0"
                style={{
                  clipPath: ISLAND_SHAPE,
                  background:
                    "linear-gradient(178deg, #7ED957 0%, #24401A 48%, #0D140A 100%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  clipPath: ISLAND_SHAPE,
                  background:
                    "linear-gradient(178deg, rgba(226,255,196,0.5) 0%, transparent 34%)",
                }}
              />
              <div
                className="absolute left-1/2 top-[100%] -translate-x-1/2 rounded-[50%]"
                style={{
                  width: "54%",
                  height: 7,
                  background:
                    "radial-gradient(ellipse, rgba(0,0,0,0.6), transparent 72%)",
                  filter: "blur(3px)",
                }}
              />
            </div>
          </motion.div>

          {chips[i] && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 @xl:mt-4 bg-[var(--navy-3)] border border-[var(--line)] px-1.5 @xl:px-3 py-0.5 @xl:py-1.5 whitespace-nowrap">
              <TextContent
                content={chips[i].label}
                className="font-mono uppercase tracking-[0.14em] text-[var(--ice)] text-[6px] @xl:text-[11px]"
              />
              <span className="text-[var(--steel)]"> → </span>
              <TextContent
                content={chips[i].value}
                className="font-mono uppercase tracking-[0.14em] text-[6px] @xl:text-[11px]"
              />
            </div>
          )}
        </motion.div>
      ))}

      {/* headline block */}
      <div className="absolute left-0 right-0 bottom-0 p-3 @xl:p-10 bg-gradient-to-t from-[var(--navy-0)] to-transparent">
        <TextContent
          content={headline}
          className="font-display font-semibold text-white text-lg @xl:text-6xl leading-none tracking-[-0.02em]"
        />
        <div className="inline-block mt-2 @xl:mt-6 bg-[var(--blue)] border border-[var(--cyan)] px-3 @xl:px-8 py-1 @xl:py-3">
          <TextContent
            content={cta}
            className="font-mono uppercase tracking-[0.14em] text-[var(--cyan)] text-[9px] @xl:text-lg"
          />
        </div>
      </div>
    </div>
  );
}
