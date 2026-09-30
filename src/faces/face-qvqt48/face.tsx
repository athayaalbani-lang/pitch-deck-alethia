import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { TextContent } from "@/components/ui/text-content";
import { Atmosphere } from "@/components/ui/atmosphere";
import { FloatingIslands } from "@/components/ui/floating-islands";
import { Capsule } from "@/components/ui/sbs";
import { Overline, Ring } from "@/components/ui/8bit";
import { blocks } from "./face.content.json";
import { controls } from "./face.controls.json";

const MONO = "font-grotesk uppercase tracking-[0.18em]";
const ACCENTS = ["var(--cyan)", "var(--steel)", "var(--cyan)"];

export default function AudienceFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });
  const indent = controls.tierIndent?.value ?? 48;

  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere ring="top-left" bokeh={14}>
      <div className="w-full h-full flex flex-col @xl:flex-row">
      {/* LEFT GUTTER — FUNNEL */}
      <div className="@xl:w-[18%] border-b @xl:border-b-0 @xl:border-r border-[var(--line)] px-5 py-3 @xl:px-7 @xl:py-10 flex flex-col justify-center gap-2 @xl:gap-8">
        <div className="flex items-center gap-2.5">
          <Ring size={14} thickness={0.5} color="var(--steel)" />
          <TextContent
            content={blocks.funnelHeading.content}
            data-content-keys={["funnelHeading"]}
            className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-xs`}
          />
        </div>
        {blocks.funnel.rows.map((row, i) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, x: -14 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.14 }}
            style={{ paddingLeft: `${i * 10}px` }}
            className="relative border-l border-[var(--line)] pl-3 @xl:pl-4"
          >
            <TextContent
              content={row.figure}
              data-content-keys={[`funnel.rows.${i}.figure`]}
              className={`${MONO} text-[var(--cyan)] text-sm @xl:text-3xl`}
            />
            <TextContent
              content={row.label}
              data-content-keys={[`funnel.rows.${i}.label`]}
              className={`${MONO} text-[var(--muted)] text-[7px] @xl:text-[11px] mt-0.5 @xl:mt-2 leading-snug`}
            />
          </motion.div>
        ))}
      </div>

      {/* CENTER — TIER BANDS */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="px-5 pt-4 pb-2 @xl:px-12 @xl:pt-9 @xl:pb-5 border-b border-[var(--line)]">
          <Overline color="var(--steel)">
              <TextContent content={blocks.badge.content} data-content-keys={["badge"]} />
            </Overline>
            <TextContent
              content={blocks.title.content}
              data-content-keys={["title"]}
              className="font-condensed font-bold text-white text-[34px] @xl:text-[76px] leading-[0.88] tracking-[-0.02em] mt-1 @xl:mt-3"
            />
          </div>

        <div className="flex-1 min-h-0 flex flex-col">
          {blocks.tiers.rows.map((row, i) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.13 }}
                className="flex-1 min-h-0 flex flex-col justify-center px-4 py-3 @xl:px-8 @xl:py-6 border-b border-[var(--line)]"
                style={{
                  background: ["var(--navy-3)", "var(--navy-2)", "var(--navy-1)"][i % 3],
                  borderLeft: `3px solid ${ACCENTS[i % 3]}`,
                }}
              >
              <div className="flex items-center gap-3 @xl:gap-6">
                <TextContent
                  content={row.name}
                  data-content-keys={[`tiers.rows.${i}.name`]}
                  className="font-condensed font-bold text-white text-[18px] @xl:text-[30px] leading-none tracking-[-0.01em]"
                />
              </div>
              <TextContent
                content={row.description}
                data-content-keys={[`tiers.rows.${i}.description`]}
                className="font-grotesk text-[var(--body)] text-[9px] @xl:text-[15px] mt-1.5 @xl:mt-2.5 leading-snug"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* RIGHT RAIL — MVP */}
      <div className="@xl:w-[22%] border-t @xl:border-t-0 @xl:border-l border-[var(--line)] px-5 py-4 @xl:px-8 @xl:py-10 flex flex-col gap-3 @xl:gap-6">
        <Capsule size="sm" tilt={-2}>
          <TextContent
            content={blocks.mvpHeading.content}
            data-content-keys={["mvpHeading"]}
          />
        </Capsule>
        <div className="flex flex-col gap-1.5 @xl:gap-3">
          {blocks.mvpItems.rows.map((row, i) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.07 }}
              className="border-b border-[var(--line)] pb-1 @xl:pb-2"
            >
              <TextContent
                content={row.label}
                data-content-keys={[`mvpItems.rows.${i}.label`]}
                className={`${MONO} text-[var(--body)] text-[8px] @xl:text-[13px] leading-snug`}
              />
            </motion.div>
          ))}
        </div>
        <div className="mt-auto border border-[var(--hairline)] px-3 py-2 @xl:px-4 @xl:py-4">
          <TextContent
            content={blocks.targetNote.content}
            data-content-keys={["targetNote"]}
            className={`${MONO} text-[var(--amber)] text-[8px] @xl:text-[12px] leading-relaxed`}
          />
        </div>
      </div>
      </div>
      </Atmosphere>
    </div>
  );
}
