import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { TextContent } from "@/components/ui/text-content";
import { MaskReveal } from "@/components/ui/motion";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Capsule } from "@/components/ui/sbs";
import { navigateTo } from "@/utils/face-navigation";
import { blocks } from "./face.content.json";
import { controls } from "./face.controls.json";
import { NodeGraph } from "./components/node-graph";

const MONO = "font-grotesk uppercase tracking-[0.18em]";

export default function OpeningFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.3 });
  const showGraph = controls.showNodeRender?.value ?? true;

  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere ghost="A" ring="bottom-right" bokeh={20}>
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 min-h-0 flex flex-col @xl:flex-row">
        {/* LEFT 60% */}
        <div className="@xl:w-[60%] flex flex-col justify-center px-5 py-5 @xl:px-16 @xl:py-12 gap-3 @xl:gap-8 border-b @xl:border-b-0 @xl:border-r border-[var(--line)]">
          <MaskReveal>
          <motion.div
            initial={{ opacity: 0, filter: "blur(12px)", y: 18 }}
            animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
            transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
          >
            <TextContent
              content={blocks.wordmark.content}
              data-content-keys={["wordmark"]}
              className="font-condensed font-bold text-white text-5xl @xl:text-[168px] leading-[0.82] tracking-[-0.02em] break-words"
            />
            <motion.div
              className="h-px w-full bg-[var(--cyan)] mt-3 @xl:mt-6"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
              style={{ transformOrigin: "left" }}
            />
            <TextContent
              content={blocks.tagline.content}
              data-content-keys={["tagline"]}
              className="font-grotesk text-[var(--ice)] text-base @xl:text-[30px] mt-3 @xl:mt-6 max-w-[900px]"
            />
          </motion.div>
          </MaskReveal>

          <div className="grid grid-cols-2 @xl:grid-cols-4 gap-2 @xl:gap-4">
            {blocks.stats.rows.map((row, i) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.09 }}
                className="border border-[var(--line)] px-3 py-2 @xl:px-5 @xl:py-5"
              >
                <TextContent
                  content={row.figure}
                  data-content-keys={[`stats.rows.${i}.figure`]}
                  className={`font-condensed font-bold text-[var(--cyan)] text-[24px] @xl:text-[52px] leading-none`}
                />
                <TextContent
                  content={row.caption}
                  data-content-keys={[`stats.rows.${i}.caption`]}
                  className={`${MONO} text-[var(--muted)] text-[7px] @xl:text-[15px] mt-1 @xl:mt-3 leading-snug`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT 40% */}
        <div className="@xl:w-[40%] flex flex-col px-5 py-4 @xl:px-10 @xl:py-10 gap-3 @xl:gap-8 min-h-0">
          {showGraph && (
            <div className="hidden @xl:block flex-1 min-h-0">
              <NodeGraph
                active={inView}
                nodes={blocks.graphNodes.rows.map((r) => r.label)}
                adminLabel={blocks.graphAdmin.content}
              />
            </div>
          )}
          <div className="flex flex-col">
            {blocks.features.rows.map((row, i) => (
              <motion.button
                key={row.id}
                type="button"
                onClick={() => navigateTo({ faceId: row.faceId })}
                initial={{ opacity: 0, x: 14 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.06 }}
                className="group flex items-center gap-3 @xl:gap-5 py-1.5 @xl:py-2.5 border-b border-[var(--line)] text-left"
              >
                <TextContent
                  content={row.num}
                  data-content-keys={[`features.rows.${i}.num`]}
                  className={`${MONO} text-[var(--cyan)] text-[9px] @xl:text-[19px]`}
                />
                <TextContent
                  content={row.label}
                  data-content-keys={[`features.rows.${i}.label`]}
                  className={`${MONO} text-[var(--muted)] group-hover:text-white transition-colors text-[9px] @xl:text-[19px]`}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-[var(--line)] grid grid-cols-1 @xl:grid-cols-3">
        {blocks.tags.rows.map((row, i) => (
          <TextContent
            key={row.id}
            content={row.label}
            data-content-keys={[`tags.rows.${i}.label`]}
            className={`${MONO} text-[var(--ice)] text-[8px] @xl:text-[19px] px-5 @xl:px-10 py-2 @xl:py-5 border-t @xl:border-t-0 @xl:border-l first:border-t-0 first:@xl:border-l-0 border-[var(--line)]`}
          />
        ))}
      </div>
      </div>
      </Atmosphere>
    </div>
  );
}
