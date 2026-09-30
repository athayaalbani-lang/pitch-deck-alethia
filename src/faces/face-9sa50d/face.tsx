import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { blocks } from "./face.content.json";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Overline, Ring } from "@/components/ui/8bit";
import { Capsule } from "@/components/ui/sbs";
import { LevelSprites } from "@/components/ui/pixel-art";
import { TextContent } from "@/components/ui/text-content";
import DonutChartViz from "./components/DonutChartViz";
import RadialBarViz from "./components/RadialBarViz";

const MONO = "font-grotesk uppercase tracking-[0.18em]";

const YOU = 320;
const CAP = 550;

export default function TrainingInsightFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });
  const [rank, setRank] = useState(3);
  const [state, setState] = useState(1);

  const levels = blocks.levels.rows;
  const states = blocks.states.rows;
  const rankValue = Number(levels[rank].value) || 0;
  const progress = Math.min((YOU / CAP) * 100, 100);

  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere ghost="320" ring="center">
        <div className="w-full h-full flex flex-col @xl:flex-row">
        {/* LEFT — identity of the operator */}
        <div className="@xl:w-[30%] shrink-0 bg-[var(--navy-1)] border-b @xl:border-b-0 @xl:border-r border-[var(--line)] px-6 @xl:px-12 py-5 @xl:py-9 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <Ring size={20} thickness={0.4} color="var(--cyan)" />
              <Overline>
                <TextContent content={blocks.label.content} data-content-keys={["label"]} />
              </Overline>
            </div>
            <TextContent
              content={blocks.title.content}
              data-content-keys={["title"]}
              className="font-condensed font-semibold text-white text-[26px] @xl:text-[52px] leading-[0.98] tracking-[-0.02em] mt-3 @xl:mt-5"
            />

            {/* The rank ladder, as three turning sprites. Sits in the gap
                between the title and the headline figure. */}
            <motion.div
              className="mt-4 @xl:mt-9"
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <LevelSprites size={78} />
            </motion.div>
          </motion.div>

          {/* headline figure */}
          <div className="mt-auto pt-6 @xl:pt-0">
            <TextContent
              content={blocks.caption.content}
              data-content-keys={["caption"]}
              className={`${MONO} text-[var(--steel)] text-[9px] @xl:text-[14px]`}
            />
            <div className="flex items-end gap-2 @xl:gap-4 mt-1 @xl:mt-3">
              <span className="font-condensed font-bold text-[var(--cyan)] text-[42px] @xl:text-[88px] leading-[0.82] tracking-[-0.03em]">
                {YOU}
              </span>
              <span
                className={`${MONO} text-[var(--steel)] text-[9px] @xl:text-[14px] pb-1 @xl:pb-3`}
              >
                pts
              </span>
            </div>

            <TextContent
              content={blocks.scoreExplainer.content}
              data-content-keys={["scoreExplainer"]}
              className="font-grotesk text-[var(--muted)] text-[9px] @xl:text-[16px] leading-snug mt-2 @xl:mt-4"
            />

            <div className="mt-3 @xl:mt-6 h-1.5 @xl:h-3 bg-[var(--navy-3)]">
              <motion.div
                className="h-full bg-[var(--cyan)]"
                initial={{ width: 0 }}
                animate={inView ? { width: `${progress}%` } : {}}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-1.5 @xl:mt-3">
              <span className={`${MONO} text-[var(--cyan)] text-[9px] @xl:text-[13px]`}>
                {blocks.you.content}
              </span>
              <span className={`${MONO} text-[var(--steel)] text-[9px] @xl:text-[13px]`}>
                {blocks.next.content} · {CAP}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — two linked views */}
        <div className="flex-1 min-w-0 flex flex-col @xl:flex-row">
          {/* LEDGER */}
          <div className="flex-1 min-h-0 flex flex-col border-b @xl:border-b-0 @xl:border-r border-[var(--line)] px-6 @xl:px-10 py-5 @xl:py-9">
            <div className="flex items-baseline justify-between gap-4 shrink-0">
              <TextContent
                content={blocks.levelsHeading.content}
                data-content-keys={["levelsHeading"]}
                className={`${MONO} text-[var(--cyan)] text-[10px] @xl:text-[15px]`}
              />
              <span
                className={`${MONO} text-[var(--steel)] text-[9px] @xl:text-[13px] tabular-nums`}
              >
                {rankValue} pts
              </span>
            </div>

            <div className="flex-1 min-h-0 min-h-[150px] @xl:min-h-0">
              <DonutChartViz
                rows={blocks.levels.rows}
                activeIndex={rank}
                onSelect={setRank}
              />
            </div>

            <div className="shrink-0 flex flex-wrap items-center gap-2 @xl:gap-3 mt-3 @xl:mt-5">
              {levels.map((l, i) => {
                const on = rank === i;
                const reached = YOU >= (Number(l.value) || 0);
                return (
                  <Capsule
                    key={l.id}
                    size="sm"
                    tilt={i % 2 === 0 ? -2 : 2}
                    dimmed={!on}
                    glow={reached}
                    onClick={() => setRank(i)}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.label}</span>
                      <span style={{ opacity: 0.6 }}>{l.value}</span>
                    </span>
                  </Capsule>
                );
              })}
            </div>
          </div>

          {/* MASTERY */}
          <div className="flex-1 min-h-0 flex flex-col px-6 @xl:px-10 py-5 @xl:py-9">
            <div className="flex items-baseline justify-between gap-4 shrink-0">
              <TextContent
                content={blocks.statesHeading.content}
                data-content-keys={["statesHeading"]}
                className={`${MONO} text-[var(--cyan)] text-[10px] @xl:text-[15px]`}
              />
              <span
                className={`${MONO} text-[var(--steel)] text-[9px] @xl:text-[13px]`}
              >
                server-scored
              </span>
            </div>

            <div className="flex-1 min-h-0 min-h-[150px] @xl:min-h-0">
              <RadialBarViz rows={blocks.states.rows} activeIndex={state} />
            </div>

            <TextContent
              content={blocks.statesExplainer.content}
              data-content-keys={["statesExplainer"]}
              className="font-grotesk text-[var(--muted)] text-[9px] @xl:text-[15px] leading-snug shrink-0 mt-2 @xl:mt-4"
            />

            <div className="shrink-0 flex flex-wrap items-center gap-2 @xl:gap-4 mt-3 @xl:mt-5">
              {states.map((s, i) => (
                <Capsule
                  key={s.id}
                  size="sm"
                  tilt={i % 2 === 0 ? -2 : 2}
                  dimmed={state !== i}
                  onClick={() => setState(i)}
                >
                  {s.label}
                </Capsule>
              ))}
            </div>
          </div>
        </div>
      </div>
      </Atmosphere>
    </div>
  );
}
