import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { TextContent } from "@/components/ui/text-content";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Capsule } from "@/components/ui/sbs";
import { PixelShard, LevelSprites } from "@/components/ui/pixel-art";
import { Overline, Ring } from "@/components/ui/8bit";
import { blocks } from "./face.content.json";
import { controls } from "./face.controls.json";

const MONO = "font-grotesk uppercase tracking-[0.18em]";
const FIGURE_COLORS = [
  "var(--cyan)",
  "var(--cyan)",
  "var(--ice)",
  "var(--steel)",
];

export default function DashboardFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });
  const [claimed, setClaimed] = useState(false);
  const barHeight = controls.barThickness?.value ?? 6;

  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere ghost="DASH" ring="bottom-right" bokeh={14}>
      <div className="w-full h-full flex flex-col">
      {/* TOP STRIP */}
      <div className="grid grid-cols-2 @xl:grid-cols-4 border-b border-[var(--line)]">
        {blocks.stats.rows.map((row, i) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, y: -12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.09 }}
            className="border-l border-b @xl:border-b-0 border-[var(--line)] first:border-l-0 px-3 py-2 @xl:px-8 @xl:py-6"
          >
            <TextContent
              content={row.label}
              data-content-keys={[`stats.rows.${i}.label`]}
              className={`${MONO} text-[var(--steel)] text-[7px] @xl:text-[15px]`}
            />
            <TextContent
              content={row.figure}
              data-content-keys={[`stats.rows.${i}.figure`]}
              className="font-condensed font-bold text-[28px] @xl:text-[62px] leading-none mt-0.5 @xl:mt-2"
              style={{ color: FIGURE_COLORS[i % 4] }}
            />
            <div
              className="w-full bg-[var(--navy-4)] mt-1.5 @xl:mt-4"
              style={{ height: `${barHeight}px` }}
            >
              <motion.div
                className="h-full bg-[var(--cyan)]"
                initial={{ width: 0 }}
                animate={inView ? { width: `${Number(row.progress) || 0}%` } : {}}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.1 }}
              />
            </div>
            <TextContent
              content={row.caption}
              data-content-keys={[`stats.rows.${i}.caption`]}
              className={`${MONO} text-[var(--muted)] text-[6px] @xl:text-[11px] mt-1 @xl:mt-2`}
            />
          </motion.div>
        ))}
      </div>

      <div className="flex-1 min-h-0 flex flex-col @xl:flex-row">
        {/* LEFT — STREAK */}
        <div className="@xl:w-[38%] border-b @xl:border-b-0 @xl:border-r border-[var(--line)] px-4 py-3 @xl:px-10 @xl:py-8 flex flex-col justify-center gap-2 @xl:gap-5">
          <Capsule size="sm" tilt={-2} glow={false} align="left">
            <TextContent
              content={blocks.streakHeading.content}
              data-content-keys={["streakHeading"]}
            />
          </Capsule>
          <div className="flex items-end gap-3 @xl:gap-6">
            <PixelShard size={168} />
            <div>
              <TextContent
                content={blocks.streakDays.content}
                data-content-keys={["streakDays"]}
                className="font-display font-semibold text-white text-4xl @xl:text-[96px] leading-none"
              />
              <TextContent
                content={blocks.streakLongest.content}
                data-content-keys={["streakLongest"]}
                className={`${MONO} text-[var(--muted)] text-[8px] @xl:text-sm mt-1 @xl:mt-2`}
              />
            </div>
          </div>
          <div className="flex gap-1 @xl:gap-2">
            {blocks.week.rows.map((row, i) => (
              <div key={row.id} className="flex-1 flex flex-col items-center gap-1 @xl:gap-2">
                <motion.div
                  initial={{ opacity: 0, scaleY: 0.3 }}
                  animate={inView ? { opacity: 1, scaleY: 1 } : {}}
                  transition={{ duration: 0.35, delay: 0.5 + i * 0.06 }}
                  className="w-full h-4 @xl:h-10"
                  style={{
                    background: row.done ? "var(--green)" : "var(--navy-4)",
                    border: row.done ? "none" : "1px solid var(--line)",
                  }}
                />
                <TextContent
                  content={row.day}
                  data-content-keys={[`week.rows.${i}.day`]}
                  className={`${MONO} text-[var(--steel)] text-[6px] @xl:text-[11px]`}
                />
              </div>
            ))}
          </div>

          {/* The rank ladder, as three turning sprites. The streak column is
              the only one on this slide that talks about level, and the space
              under the week row was dead. */}
          <motion.div
            className="mt-auto pt-4 @xl:pt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <LevelSprites size={68} gap={12} />
          </motion.div>
        </div>

        {/* RIGHT — QUEST */}
        <div className="@xl:w-[62%] bg-[var(--navy-0)] px-4 py-3 @xl:px-12 @xl:py-8 flex flex-col justify-center gap-3 @xl:gap-6">
          <TextContent
            content={blocks.questHeading.content}
            data-content-keys={["questHeading"]}
            className={`${MONO} text-[var(--steel)] text-[9px] @xl:text-base`}
          />
          <div className="bg-[var(--navy-3)] border border-[var(--line)] px-4 py-3 @xl:px-9 @xl:py-7 flex flex-col @xl:flex-row @xl:items-center gap-3 @xl:gap-8">
            <div className="flex-1">
              <TextContent
                content={blocks.questTitle.content}
                data-content-keys={["questTitle"]}
                className="font-display font-semibold text-[var(--body)] text-base @xl:text-4xl leading-tight"
              />
              <TextContent
                content={blocks.questDetail.content}
                data-content-keys={["questDetail"]}
                className="text-[var(--muted)] text-[9px] @xl:text-lg mt-1 @xl:mt-3"
              />
            </div>
            <div className="flex items-center gap-3 @xl:gap-6">
              <TextContent
                content={blocks.questReward.content}
                data-content-keys={["questReward"]}
                className={`${MONO} text-[var(--cyan)] text-sm @xl:text-3xl`}
              />
              <Capsule
                size="sm"
                tilt={-1.5}
                dimmed={claimed}
                onClick={() => setClaimed((c) => !c)}
              >
                <TextContent
                  content={
                    claimed ? blocks.claimedLabel.content : blocks.claimLabel.content
                  }
                  data-content-keys={claimed ? ["claimedLabel"] : ["claimLabel"]}
                />
              </Capsule>
            </div>
          </div>

          <div className="bg-[var(--navy-4)] border-l-[3px] border-[var(--amber)] px-3 @xl:px-7 py-2 @xl:py-5">
            <TextContent
              content={blocks.retirementNotice.content}
              data-content-keys={["retirementNotice"]}
              className={`${MONO} text-[var(--amber)] text-[8px] @xl:text-base leading-relaxed`}
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-[var(--line)] px-5 @xl:px-12 py-1.5 @xl:py-4">
        <TextContent
          content={blocks.footer.content}
          data-content-keys={["footer"]}
          className="font-grotesk text-[var(--steel)] text-[7px] @xl:text-[13px] leading-relaxed"
        />
      </div>
      </div>
      </Atmosphere>
    </div>
  );
}
