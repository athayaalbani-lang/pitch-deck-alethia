import React from "react";
import { motion } from "motion/react";
import { QrCode } from "lucide-react";
import { Atmosphere } from "@/components/ui/atmosphere";
import { MaskReveal } from "@/components/ui/motion";
import { Capsule } from "@/components/ui/sbs";
import { Ring } from "@/components/ui/8bit";
import { TextContent } from "@/components/ui/text-content";
import { navigateTo } from "@/utils/face-navigation";
import { blocks, tables } from "./face.content.json";

const MONO = "font-terminal uppercase tracking-[0.18em]";

/* Same ramp as the `Capsule` primitive, restated here because the hero line is
   one long sentence that would overflow the primitive's fixed type scale. */
const CAPSULE_RAMP =
  "var(--spectrum)";

/* The mock wraps the recap pills 4 + 3; slicing keeps that break explicit
   rather than leaving it to flex-wrap. */
const PILL_ROWS = [tables.recapTiles.rows.slice(0, 4), tables.recapTiles.rows.slice(4)];

export default function ClosingFace() {
  return (
    <div className="h-full w-full font-body text-[var(--ice)]">
      <Atmosphere
        ghost="GO"
        ghostFloat={{ right: "-2%", bottom: "-26%", size: "76vh" }}
        ring="center"
        bokeh={14}
      >
        <div className="flex h-full w-full flex-col px-4 py-3 @xl:px-14 @xl:py-7">
          <header className="flex shrink-0 items-center justify-between border-b border-[var(--line)] pb-2.5 @xl:pb-4">
            <div className="flex items-center gap-2.5 @xl:gap-3">
              <Ring size={13} thickness={0.5} color="var(--cyan)" />
              <TextContent
                content={blocks.badge.content}
                data-content-keys={["badge"]}
                className={`${MONO} text-[var(--cyan)] text-[7px] @xl:text-[15px] font-semibold`}
              />
            </div>
            <TextContent
              content={blocks.statusLabel.content}
              data-content-keys={["statusLabel"]}
              className={`${MONO} text-[var(--steel)] text-[6px] @xl:text-[13px]`}
            />
          </header>

          <main className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
            <MaskReveal>
              <motion.h1
                initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                className="font-condensed text-[54px] @xl:text-[150px] font-black leading-[0.82] tracking-[-0.05em] text-white"
              >
                {blocks.wordmark.content}
              </motion.h1>
            </MaskReveal>

            <p className="mt-3 @xl:mt-6 max-w-[1180px] text-[11px] @xl:text-[34px] font-medium leading-tight tracking-[-0.025em] text-[var(--body)]">
              {blocks.tagline.content}
            </p>

            <nav
              aria-label="Demo recap"
              className="mt-5 @xl:mt-8 flex flex-col items-center gap-2.5 @xl:gap-4"
            >
              {PILL_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-wrap items-center justify-center gap-2 @xl:gap-5">
                  {row.map((tile, index) => (
                    <Capsule
                      key={tile.id}
                      size="md"
                      tilt={-1.5}
                      onClick={() => navigateTo({ faceId: tile.targetFaceId })}
                    >
                      <span className="font-terminal text-[11px] @xl:text-[20px] uppercase tracking-[0.04em]">
                        {tile.num} {tile.label}
                      </span>
                    </Capsule>
                  ))}
                </div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.33, 1, 0.68, 1] }}
              className="relative mt-5 @xl:mt-9 inline-flex max-w-full items-center rounded-full px-6 @xl:px-12 py-3 @xl:py-6"
              style={{
                background: CAPSULE_RAMP,
                transform: "rotate(-0.6deg)",
                boxShadow:
                  "0 10px 34px -8px rgba(166,232,107,0.55), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              <span
                className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-full opacity-30"
                style={{ background: "linear-gradient(to bottom, #fff, transparent)" }}
                aria-hidden="true"
              />
              <TextContent
                content={blocks.heroLine.content}
                data-content-keys={["heroLine"]}
                className="relative font-grotesk text-[12px] @xl:text-[27px] font-bold leading-tight tracking-[-0.01em] text-[var(--ink-0)]"
              />
            </motion.div>

            <div className="mt-5 @xl:mt-9 flex items-center gap-3 @xl:gap-4">
              <Ring size={12} thickness={0.5} color="var(--cyan)" />
              <TextContent
                content={blocks.closingStatement.content}
                data-content-keys={["closingStatement"]}
                className={`${MONO} text-left text-[var(--cyan)] text-[6px] @xl:text-[17px] font-semibold`}
              />
            </div>
          </main>

          <footer className="flex shrink-0 items-center justify-center gap-3 @xl:gap-4 pt-3 @xl:pt-6">
            <QrCode
              aria-hidden="true"
              className="h-4 @xl:h-6 w-4 @xl:w-6 text-[var(--steel)]"
              strokeWidth={2.5}
            />
            <TextContent
              content={blocks.footerLabel.content}
              data-content-keys={["footerLabel"]}
              className={`${MONO} text-[var(--steel)] text-[6px] @xl:text-[12px]`}
            />
          </footer>
        </div>
      </Atmosphere>
    </div>
  );
}