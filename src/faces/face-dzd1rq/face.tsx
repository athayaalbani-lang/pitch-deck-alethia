import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { TextContent } from "@/components/ui/text-content";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Capsule, NeonFrame } from "@/components/ui/sbs";
import { Overline, Ring } from "@/components/ui/8bit";
import { blocks } from "./face.content.json";
import { controls } from "./face.controls.json";

const MONO = "font-grotesk uppercase tracking-[0.18em]";

export default function ComparisonFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });
  const [active, setActive] = useState(0);
  const dim = controls.dimThem?.value ?? true;

  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere ghost="VS" ring="bottom-right" bokeh={12}>
      <div className="w-full h-full flex flex-col">
      {/* TITLE */}
      <div className="px-5 py-3 @xl:px-12 @xl:py-6 border-b border-[var(--line)] flex flex-col @xl:flex-row @xl:items-end @xl:justify-between gap-2 @xl:gap-8">
        <TextContent
          content={blocks.title.content}
          data-content-keys={["title"]}
          className="font-condensed font-bold text-white text-[26px] @xl:text-[64px] leading-[0.9] tracking-[-0.02em]"
        />
        <div className="flex items-center gap-3 @xl:gap-4">
          <Ring size={16} thickness={0.5} color="var(--cyan)" />
          <TextContent
            content={blocks.badge.content}
            data-content-keys={["badge"]}
            className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-sm`}
          />
        </div>
      </div>

      {/* HEADER ROW */}
      <div className="flex border-b border-[var(--line)]">
        <div className="w-[22%] @xl:w-[15%] bg-[var(--navy-0)] px-2 @xl:px-6 py-1.5 @xl:py-4 border-r border-[var(--line)]" />
        <div className="flex-1 bg-[var(--navy-1)] px-2 @xl:px-8 py-1.5 @xl:py-4 border-r border-[var(--line)]">
          <TextContent
            content={blocks.themHeader.content}
            data-content-keys={["themHeader"]}
            className={`${MONO} text-[var(--steel)] text-[9px] @xl:text-lg`}
          />
        </div>
        <div className="flex-1 bg-[var(--navy-3)] px-2 @xl:px-8 py-1.5 @xl:py-4">
          <TextContent
            content={blocks.usHeader.content}
            data-content-keys={["usHeader"]}
            className={`${MONO} text-[var(--cyan)] text-[9px] @xl:text-lg`}
          />
        </div>
      </div>

      {/* ROWS */}
      <div className="flex-1 min-h-0 flex flex-col">
        {blocks.rows.rows.map((row, i) => {
          const isActive = active === i;
          return (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.12 + i * 0.08 }}
              onPointerEnter={() => setActive(i)}
              className="flex-1 min-h-0 flex border-b border-[var(--line)] cursor-default"
            >
              <div
                className="w-[22%] @xl:w-[15%] px-2 @xl:px-6 flex items-center border-r border-[var(--line)]"
                style={{ background: isActive ? "var(--navy-4)" : "var(--navy-0)" }}
              >
                <TextContent
                  content={row.label}
                  data-content-keys={[`rows.rows.${i}.label`]}
                  className={`${MONO} text-[var(--amber)] text-[7px] @xl:text-[13px] leading-tight`}
                />
              </div>
              <div
                className="flex-1 px-2 @xl:px-8 flex items-center border-r border-[var(--line)] transition-opacity"
                style={{
                  background: i % 2 === 0 ? "var(--navy-2)" : "var(--navy-3)",
                  opacity: dim && !isActive ? 0.55 : 1,
                }}
              >
                <TextContent
                  content={row.them}
                  data-content-keys={[`rows.rows.${i}.them`]}
                  className="text-[var(--muted)] text-[9px] @xl:text-xl leading-snug"
                />
              </div>
              <div
                className="flex-1 px-2 @xl:px-8 flex items-center relative"
                style={{ background: i % 2 === 0 ? "var(--navy-3)" : "var(--navy-2)" }}
              >
                {isActive ? (
                  <Capsule size="sm" tilt={-1} glow>
                    <TextContent
                      content={row.us}
                      data-content-keys={[`rows.rows.${i}.us`]}
                    />
                  </Capsule>
                ) : (
                  <TextContent
                    content={row.us}
                    data-content-keys={[`rows.rows.${i}.us`]}
                    className="text-[var(--body)] text-[9px] @xl:text-xl leading-snug"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* BOTTOM BAND */}
      <div className="border-t border-[var(--line)] px-5 @xl:px-16 py-2 @xl:py-6 flex items-center justify-center">
        <TextContent
          content={blocks.closing.content}
          data-content-keys={["closing"]}
          className="font-condensed font-medium text-[var(--ice)] text-center text-[13px] @xl:text-[30px] leading-snug"
        />
      </div>
      </div>
      </Atmosphere>
    </div>
  );
}
