import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { TextContent } from "@/components/ui/text-content";
import { Icon } from "@/components/ui/icon";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Capsule } from "@/components/ui/sbs";
import { Ring } from "@/components/ui/8bit";
import { blocks } from "./face.content.json";
import { controls } from "./face.controls.json";

const MONO = "font-grotesk uppercase tracking-[0.18em]";

export default function TrainingFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });
  const [selected, setSelected] = useState(0);
  const showRoutes = controls.showRoutes?.value ?? true;

  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere ghost="TRN" ring="bottom-left" bokeh={14}>
      <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0 flex flex-col @xl:flex-row">
        {/* LEFT 30% — ROADMAP */}
        <div className="@xl:w-[30%] border-b @xl:border-b-0 @xl:border-r border-[var(--line)] px-4 py-3 @xl:px-9 @xl:py-9 flex flex-col">
          <div className="flex items-center gap-2.5">
            <Ring size={14} thickness={0.5} color="var(--steel)" />
            <TextContent
              content={blocks.badge.content}
              data-content-keys={["badge"]}
              className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-[15px]`}
            />
          </div>
          <TextContent
            content={blocks.title.content}
            data-content-keys={["title"]}
            className="font-condensed font-bold text-white text-[26px] @xl:text-[58px] leading-[0.9] tracking-[-0.02em] mt-1 @xl:mt-3"
          />
          <div className="flex-1 min-h-0 flex @xl:flex-col justify-between mt-3 @xl:mt-9 gap-2">
            {blocks.modules.rows.map((row, i) => {
              const open = row.state === "open";
              const isSel = selected === i;
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => setSelected(i)}
                  className="flex-1 flex @xl:flex-row flex-col items-center @xl:items-center gap-2 @xl:gap-5 text-left relative"
                >
                  <div className="hidden @xl:block absolute left-[13px] top-1/2 w-px h-full bg-[var(--line)] -z-0" />
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.45, delay: 0.2 + i * 0.16 }}
                    className="relative z-10 w-6 h-6 @xl:w-7 @xl:h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: open ? "var(--cyan)" : "var(--navy-4)",
                      border: open ? "none" : "1px solid var(--line)",
                      boxShadow: open ? "0 0 22px -2px var(--cyan)" : "none",
                    }}
                  >
                    {!open && (
                      <Icon
                        name={blocks.lockIcon.name}
                        size={12}
                        className="text-[var(--steel)]"
                      />
                    )}
                  </motion.div>
                  <div className="min-w-0">
                    <TextContent
                      content={row.index}
                      data-content-keys={[`modules.rows.${i}.index`]}
                      className={`${MONO} text-[7px] @xl:text-xs`}
                      style={{ color: isSel ? "var(--cyan)" : "var(--steel)" }}
                    />
                    <TextContent
                      content={row.points}
                      data-content-keys={[`modules.rows.${i}.points`]}
                      className={`${MONO} text-[var(--body)] text-[9px] @xl:text-xl`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT 70% — MODULE ROWS */}
        <div className="@xl:w-[70%] bg-[var(--navy-2)] flex flex-col min-h-0">
          {blocks.modules.rows.map((row, i) => {
            const open = row.state === "open";
            const isSel = selected === i;
            return (
              <motion.button
                key={row.id}
                type="button"
                onClick={() => setSelected(i)}
                initial={{ opacity: 0, x: 18 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.18 + i * 0.12 }}
                className="flex-1 min-h-0 border-b border-[var(--line)] px-4 py-3 @xl:px-11 @xl:py-7 flex flex-col justify-center text-left relative"
                style={{ background: isSel ? "var(--navy-3)" : "transparent" }}
              >
                {isSel && (
                  <motion.div
                    layoutId="sel-bar"
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--cyan)]"
                  />
                )}
                <div className="flex items-baseline gap-2 @xl:gap-5">
                  <TextContent
                    content={row.index}
                    data-content-keys={[`modules.rows.${i}.index`]}
                    className={`${MONO} text-[var(--cyan)] text-[9px] @xl:text-lg`}
                  />
                  <TextContent
                    content={row.name}
                    data-content-keys={[`modules.rows.${i}.name`]}
                    className="font-condensed font-bold text-white text-[18px] @xl:text-[40px] tracking-[-0.01em]"
                  />
                  <Capsule
                    size="sm"
                    tilt={open ? -1.5 : 1.5}
                    glow={open}
                    dimmed={!open}
                    className="ml-auto"
                  >
                    <TextContent
                      content={row.chip}
                      data-content-keys={[`modules.rows.${i}.chip`]}
                    />
                  </Capsule>
                </div>
                <div className="flex flex-col @xl:flex-row @xl:items-baseline gap-0.5 @xl:gap-8 mt-1 @xl:mt-3">
                  {showRoutes && (
                    <TextContent
                      content={row.route}
                      data-content-keys={[`modules.rows.${i}.route`]}
                      className="font-mono text-[var(--cyan)] text-[8px] @xl:text-base"
                    />
                  )}
                  <TextContent
                    content={row.mechanic}
                    data-content-keys={[`modules.rows.${i}.mechanic`]}
                    className="text-[var(--muted)] text-[9px] @xl:text-xl"
                  />
                  <TextContent
                    content={row.points}
                    data-content-keys={[`modules.rows.${i}.points`]}
                    className={`${MONO} text-[var(--body)] text-[8px] @xl:text-base @xl:ml-auto`}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM BAND */}
      <div className="border-t border-[var(--line)] grid grid-cols-1 @xl:grid-cols-3">
        {blocks.guarantees.rows.map((row, i) => (
          <div
            key={row.id}
            className="px-4 @xl:px-9 py-1.5 @xl:py-5 border-t @xl:border-t-0 @xl:border-l first:border-t-0 first:@xl:border-l-0 border-[var(--line)]"
          >
            <TextContent
              content={row.key}
              data-content-keys={[`guarantees.rows.${i}.key`]}
              className={`${MONO} text-[var(--cyan)] text-[8px] @xl:text-[15px]`}
            />
            <TextContent
              content={row.value}
              data-content-keys={[`guarantees.rows.${i}.value`]}
              className="font-grotesk text-[var(--muted)] text-[8px] @xl:text-[15px] mt-0.5 @xl:mt-2"
            />
          </div>
        ))}
      </div>
      </div>
      </Atmosphere>
    </div>
  );
}
