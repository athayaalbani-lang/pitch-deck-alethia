import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { TextContent } from "@/components/ui/text-content";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Capsule, NeonFrame } from "@/components/ui/sbs";
import { MaskReveal } from "@/components/ui/motion";
import { Overline, Ring } from "@/components/ui/8bit";
import { blocks } from "./face.content.json";
import { controls } from "./face.controls.json";

const MONO = "font-grotesk uppercase tracking-[0.18em]";

export default function WhyExistsFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });
  const density = controls.barEmphasis?.value ?? 1;

  const maxVal = Math.max(
    ...blocks.chart.rows.map((r) => Number(r.value) || 0),
    1,
  );

  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere ghost="WHY" ring="bottom-left" bokeh={12}>
      <div className="w-full h-full flex flex-col">
      {/* TOP BAND */}
      <div className="px-5 py-4 @xl:px-14 @xl:py-8 border-b border-[var(--line)]">
        <div className="flex items-center gap-2.5 mb-1.5 @xl:mb-4">
          <Ring size={14} thickness={0.5} color="var(--steel)" />
          <TextContent
            content={blocks.badge.content}
            data-content-keys={["badge"]}
            className={`${MONO} text-[var(--steel)] text-[9px] @xl:text-sm`}
          />
        </div>
        <MaskReveal>
          <TextContent
            content={blocks.title.content}
            data-content-keys={["title"]}
            className="font-condensed font-bold text-white text-[28px] @xl:text-[74px] leading-[0.9] tracking-[-0.02em] break-words"
          />
        </MaskReveal>
        <div className="h-[3px] w-24 @xl:w-56 bg-[var(--cyan)] mt-2 @xl:mt-5" />
      </div>

      <div className="flex-1 min-h-0 flex flex-col @xl:flex-row">
        {/* LEFT 40% */}
        <div className="@xl:w-[40%] border-b @xl:border-b-0 @xl:border-r border-[var(--line)] px-5 py-4 @xl:px-12 @xl:py-9 flex flex-col justify-between gap-3 @xl:gap-6">
          <div>
            <div className="flex items-end gap-3 @xl:gap-5">
              <motion.div
                initial={{ opacity: 0, filter: "blur(14px)" }}
                animate={inView ? { opacity: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
              >
                <TextContent
                  content={blocks.heroFigure.content}
                  data-content-keys={["heroFigure"]}
                  className="font-condensed font-bold text-[var(--cyan)] text-[56px] @xl:text-[126px] leading-[0.82] tracking-[-0.04em]"
                />
              </motion.div>
            </div>
            <TextContent
              content={blocks.heroCaption.content}
              data-content-keys={["heroCaption"]}
              className={`${MONO} text-[var(--muted)] text-[9px] @xl:text-sm mt-2 @xl:mt-4 leading-relaxed max-w-[620px]`}
            />
          </div>

          <div className="flex flex-col gap-2 @xl:gap-4">
            {blocks.chart.rows.map((row, i) => {
              const pct = ((Number(row.value) || 0) / maxVal) * 100;
              return (
                <div key={row.id} className="flex flex-col gap-1 @xl:gap-2">
                  <div className="flex items-baseline justify-between">
                    <TextContent
                      content={row.period}
                      data-content-keys={[`chart.rows.${i}.period`]}
                      className={`${MONO} text-[var(--muted)] text-[8px] @xl:text-xs`}
                    />
                    <TextContent
                      content={row.amount}
                      data-content-keys={[`chart.rows.${i}.amount`]}
                      className={`${MONO} text-[var(--cyan)] text-[10px] @xl:text-lg`}
                    />
                  </div>
                  <div
                    className="w-full bg-[var(--navy-4)]"
                    style={{ height: `${6 + density * 4}px` }}
                  >
                    <motion.div
                      className="h-full bg-[var(--cyan)]"
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${pct}%` } : {}}
                      transition={{ duration: 1, delay: 0.3 + i * 0.18, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT 60% */}
        <div className="@xl:w-[60%] grid grid-cols-2 grid-rows-2">
          {blocks.statCards.rows.map((row, i) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
              className="border-b border-r border-[var(--line)] px-4 py-3 @xl:px-9 @xl:py-7 flex flex-col justify-center"
            >
              <TextContent
                content={row.figure}
                data-content-keys={[`statCards.rows.${i}.figure`]}
                className="font-condensed font-bold text-[var(--cyan)] text-[30px] @xl:text-[70px] leading-none"
              />
              <TextContent
                content={row.label}
                data-content-keys={[`statCards.rows.${i}.label`]}
                className={`${MONO} text-white text-[9px] @xl:text-base mt-1.5 @xl:mt-4`}
              />
              <TextContent
                content={row.detail}
                data-content-keys={[`statCards.rows.${i}.detail`]}
                className="font-grotesk text-[var(--muted)] text-[9px] @xl:text-base mt-1 @xl:mt-3 leading-snug"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODUS BAND */}
      <div className="border-t border-[var(--line)] grid grid-cols-1 @xl:grid-cols-3">
        {blocks.modus.rows.map((row, i) => {
          const hot = row.highlight;
          return (
            <div
              key={row.id}
              className="px-5 @xl:px-10 py-2 @xl:py-5 border-t @xl:border-t-0 @xl:border-l first:border-t-0 first:@xl:border-l-0 border-[var(--line)]"
            >
              <TextContent
                content={row.label}
                data-content-keys={[`modus.rows.${i}.label`]}
                className={`${MONO} text-[9px] @xl:text-sm ${hot ? "text-[var(--amber)]" : "text-[var(--body)]"}`}
              />
              <TextContent
                content={row.figures}
                data-content-keys={[`modus.rows.${i}.figures`]}
                className={`font-condensed font-bold text-[18px] @xl:text-[34px] mt-0.5 @xl:mt-2 ${hot ? "text-[var(--ice)]" : "text-[var(--cyan)]"}`}
              />
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="border-t border-[var(--line)] px-5 @xl:px-10 py-1.5 @xl:py-3">
        <TextContent
          content={blocks.sources.content}
          data-content-keys={["sources"]}
          className={`${MONO} text-[var(--steel)] text-[7px] @xl:text-[11px] leading-relaxed`}
        />
      </div>
      </div>
      </Atmosphere>
    </div>
  );
}
