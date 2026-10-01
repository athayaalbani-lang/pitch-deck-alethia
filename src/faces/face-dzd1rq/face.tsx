import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { TextContent } from "@/components/ui/text-content";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Capsule, NeonFrame } from "@/components/ui/sbs";
import { Overline, Ring } from "@/components/ui/8bit";
import { Glint } from "@/components/ui/anim";
import { blocks } from "./face.content.json";
import { controls } from "./face.controls.json";

const MONO = "font-terminal uppercase tracking-[0.18em]";

export default function ComparisonFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });

  // Hover previews a row; clicking pins it, so the emphasis survives the
  // pointer leaving — useful when reading a row on a projector.
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState(0);
  const active = hovered ?? pinned;
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
            <div className="w-[22%] @xl:w-[12%] bg-[var(--navy-0)] px-2 @xl:px-6 py-1.5 @xl:py-4 border-r border-[var(--line)]" />
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
                <motion.button
                  key={row.id}
                  type="button"
                  onClick={() => setPinned(i)}
                  onPointerEnter={() => setHovered(i)}
                  onPointerLeave={() => setHovered(null)}
                  aria-pressed={isActive}
                  className="relative flex-1 min-h-0 flex w-full cursor-pointer border-b border-[var(--line)] text-left"
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.12 + i * 0.08 }}
                  style={{ perspective: 900 }}
                >
                  {/* Active-row marker in the label gutter. */}
                  {isActive ? (
                    <motion.span
                      layoutId="compare-active-row"
                      aria-hidden="true"
                      className="absolute left-0 top-0 w-[3px] bg-[var(--cyan)]"
                      style={{ height: "100%" }}
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  ) : null}

                  <div
                    className="flex w-[22%] items-center border-r border-[var(--line)] px-2 @xl:w-[12%] @xl:px-6"
                    style={{ background: isActive ? "var(--navy-4)" : "var(--navy-0)" }}
                  >
                    <TextContent
                      content={row.label}
                      className={`${MONO} text-[var(--amber)] text-[7px] @xl:text-[13px] leading-tight`}
                    />
                  </div>

                  <div
                    className="flex flex-1 items-center border-r border-[var(--line)] px-2 @xl:px-8 transition-opacity duration-300"
                    style={{
                      background: i % 2 === 0 ? "var(--navy-2)" : "var(--navy-3)",
                      opacity: dim && !isActive ? 0.5 : 1,
                    }}
                  >
                    <TextContent
                      content={row.them}
                      className="text-[var(--muted)] text-[9px] @xl:text-xl leading-snug"
                    />
                  </div>

                  <div
                    className="relative flex flex-1 items-center px-2 @xl:px-8"
                    style={{
                      background: i % 2 === 0 ? "var(--navy-3)" : "var(--navy-2)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {isActive ? (
                      <motion.div
                        className="w-fit"
                        initial={{ rotateX: 0 }}
                        animate={{ rotateX: -9, z: 34 }}
                        transition={{ type: "spring", stiffness: 170, damping: 18 }}
                        style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
                      >
                        <Capsule size="sm" tilt={-1} glow>
                          <TextContent content={row.us} />
                        </Capsule>
                      </motion.div>
                    ) : (
                      <TextContent
                        content={row.us}
                        className="text-[var(--body)] text-[9px] @xl:text-xl leading-snug"
                      />
                    )}
                    {isActive ? <Glint delay={0.12} duration={1} /> : null}
                  </div>
                </motion.button>
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
