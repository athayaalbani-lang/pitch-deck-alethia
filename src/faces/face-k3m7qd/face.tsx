import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { TextContent } from "@/components/ui/text-content";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Ring } from "@/components/ui/8bit";
import { SpectrumBar, SpectrumRule, TerminalLabel } from "@/components/ui/rewind";
import { Counter, Glint, Tilt } from "@/components/ui/anim";
import { blocks } from "./face.content.json";

const MONO = "font-terminal uppercase tracking-[0.18em]";

export default function FraudMetricsFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.2 });

  // The hero figure reads out whichever escalation window is selected, so the
  // headline number and the bar chart are always talking about the same window.
  const rows = blocks.escalation.rows;
  const [active, setActive] = useState(rows.length - 1);
  const current = rows[active];

  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere
        ghost="VIA"
        ghostFloat={{ right: "-4%", bottom: "-20%", size: "70vh" }}
        ring="bottom-right"
        bokeh={12}
      >
        <div className="w-full h-full flex flex-col">
          {/* TITLE */}
          <div className="shrink-0 px-4 pt-3 pb-2.5 @xl:px-14 @xl:pt-9 @xl:pb-7">
            <div className="flex items-center gap-2.5">
              <Ring size={13} thickness={0.5} color="var(--steel)" />
              <TextContent
                content={blocks.badge.content}
                data-content-keys={["badge"]}
                className={`${MONO} text-[var(--steel)] text-[7px] @xl:text-sm`}
              />
            </div>
            <TextContent
              content={blocks.title.content}
              data-content-keys={["title"]}
              className="font-condensed font-bold text-white text-[26px] @xl:text-[68px] leading-[0.9] tracking-[-0.02em] mt-1.5 @xl:mt-4"
            />
            <div className="mt-2 @xl:mt-5 h-[3px] @xl:h-[5px] w-[24%] @xl:w-[21%] bg-[var(--cyan)]" />
          </div>

          {/* BODY */}
          <div className="flex-1 min-h-0 flex flex-col @xl:flex-row border-t border-[var(--line)] bg-[var(--navy-0)]">
            {/* LEFT — HEADLINE LOSS + CUMULATIVE ESCALATION */}
            <div className="relative min-h-0 shrink-0 border-b @xl:border-b-0 @xl:border-r @xl:w-[38%] border-[var(--line)] px-4 py-3 @xl:px-8 @xl:py-8 flex flex-col justify-between gap-4 @xl:gap-0">
              {/* The flame sits in the empty middle of this column. Decorative,
                  and never occludes the figures: it is behind them in the
                  stacking order and this column's figures are drawn above.
                  The animation lives inside the asset itself (APNG sampled
                  from the shape reference, skull frozen, fire burning), so
                  this is a plain image — no sprite code, nothing to drive. */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden @xl:block">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[42%]">
                  <img
                    alt=""
                    className="block h-auto w-[252px] select-none"
                    draggable={false}
                    src="/media/flame-animated.png"
                  />
                </div>
              </div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                {/* Keyed so the figure re-counts when the window changes. */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Counter
                      /* The bottom padding is not decoration: it reserves room
                         for this figure's own descender.
                         `leading-[0.82]` gives a 111.5px line box for a 136px
                         condensed face whose ascent + descent is about 162px, so
                         the glyphs cannot fit inside it — "Rp 9,1 T" inks to
                         y=388 while its box ends at y=331. The window label
                         underneath began at y=342, putting a 46px overlap: the
                         descender of the "p" ran straight through it.
                         0.44em is that 57px of overflow plus a 14px gap. In em so
                         it tracks the type at both breakpoints. */
                      className="block font-condensed font-bold text-[var(--cyan)] text-[46px] @xl:text-[136px] leading-[0.82] tracking-[-0.03em] pb-[0.44em]"
                      contentKey="hero"
                      duration={1.6}
                      text={current.figure}
                    />
                    <TextContent
                      content={current.window}
                      className={`${MONO} block text-[var(--ice)] text-[7px] @xl:text-[13px] mt-1.5 @xl:mt-3`}
                    />
                  </motion.div>
                </AnimatePresence>
                <TextContent
                  content={blocks.heroCaption.content}
                  data-content-keys={["heroCaption"]}
                  className={`${MONO} block text-[var(--steel)] text-[7px] @xl:text-[15px] mt-2 @xl:mt-4`}
                />
              </motion.div>

              <div className="relative flex flex-col gap-2.5 @xl:gap-6">
                {rows.map((row, i) => {
                  const on = i === active;
                  return (
                    <motion.button
                      key={row.id}
                      type="button"
                      onClick={() => setActive(i)}
                      onPointerEnter={() => setActive(i)}
                      aria-pressed={on}
                      /* Bar length always encodes the real share. Selection is
                         shown through weight and colour only — shortening a bar
                         would misstate the figure. */
                      className="group w-full cursor-pointer text-left transition-opacity duration-300"
                      initial={{ opacity: 0, y: 12 }}
                      animate={inView ? { opacity: on ? 1 : 0.55, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.13 }}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <TextContent
                          content={row.window}
                          className={`${MONO} text-[6px] @xl:text-[11px] transition-colors ${on ? "text-[var(--ice)]" : "text-[var(--muted)]"}`}
                        />
                        <Counter
                          className={`${MONO} text-[8px] @xl:text-[17px] whitespace-nowrap transition-colors ${on ? "text-[var(--cyan)]" : "text-[var(--muted)]"}`}
                          delay={0.2 + i * 0.13}
                          duration={1.1}
                          text={row.figure}
                        />
                      </div>
                      <SpectrumBar
                        barClassName={on ? "shadow-[0_0_12px_rgba(166,232,107,.5)]" : ""}
                        className="mt-1 @xl:mt-2.5 h-[5px] @xl:h-[9px]"
                        share={row.share}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT — REPORTED INDICATORS */}
            <div className="min-h-0 flex-1 grid grid-cols-2 grid-rows-2">
              {blocks.stats.rows.map((row, i) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.18 + i * 0.09 }}
                  className={`min-h-0 flex border-[var(--line)] ${i >= 2 ? "border-b-0" : "border-b"} ${i % 2 === 1 ? "border-r-0" : "border-r"}`}
                >
                  {/* Tilted per cell, so each indicator answers the pointer. */}
                  <Tilt className="flex w-full flex-col justify-center px-3 py-3 @xl:px-8 @xl:py-6" max={4} lift={9}>
                    <Counter
                      className="block font-condensed font-bold text-[var(--cyan)] text-[26px] @xl:text-[74px] leading-none tracking-[-0.02em]"
                      contentKey={`stats.rows.${i}.figure`}
                      delay={0.3 + i * 0.12}
                      duration={1.5}
                      text={row.figure}
                    />
                    <TextContent
                      content={row.label}
                      className={`${MONO} block text-[var(--ice)] text-[7px] @xl:text-[15px] mt-1.5 @xl:mt-3`}
                    />
                    <TextContent
                      content={row.note}
                      className="block text-[var(--steel)] text-[6px] @xl:text-[15px] mt-1 @xl:mt-2"
                    />
                    <Glint delay={0.5 + i * 0.14} />
                  </Tilt>
                </motion.div>
              ))}
            </div>
          </div>

          {/* BOTTOM BAND — CATEGORY BREAKDOWN */}
          <div className="shrink-0 border-t border-[var(--line)] grid grid-cols-1 @xl:grid-cols-3">
            {blocks.categories.rows.map((row, i) => (
              <motion.button
                key={row.id}
                type="button"
                className="group cursor-pointer px-4 py-2 @xl:px-8 @xl:py-5 border-b @xl:border-b-0 border-[var(--line)] last:border-b-0 @xl:border-l @xl:first:border-l-0 text-left transition-colors hover:bg-[var(--cyan)]/[.05]"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.45, delay: 0.5 + i * 0.1 }}
              >
                <TextContent
                  content={row.label}
                  className={`${MONO} block text-[var(--muted)] text-[6px] @xl:text-[12px] transition-colors group-hover:text-[var(--ice)]`}
                />
                {/* Two figures in one string, so only the leading count is
                    animated; the loss figure stays as written. */}
                <Counter
                  className="block font-grotesk font-bold text-[var(--cyan)] text-[11px] @xl:text-[24px] mt-0.5 @xl:mt-2 tracking-tight"
                  contentKey={`categories.rows.${i}.figure`}
                  delay={0.6 + i * 0.12}
                  duration={1.4}
                  text={row.figure}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </Atmosphere>
    </div>
  );
}
