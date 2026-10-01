import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { TextContent } from "@/components/ui/text-content";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Capsule } from "@/components/ui/sbs";
import { Overline, Ring } from "@/components/ui/8bit";
import { Counter, Glint, Sprite3D, Tilt } from "@/components/ui/anim";
import { blocks } from "./face.content.json";
import { controls } from "./face.controls.json";

const MONO = "font-terminal uppercase tracking-[0.18em]";
const ACCENTS = ["var(--cyan)", "var(--cyan)", "var(--cyan)"];

export default function AudienceFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });
  const indent = controls.tierIndent?.value ?? 48;
  // Hovering a tier band lifts it; the selection is what the MVP rail echoes.
  const [active, setActive] = useState<number | null>(null);

  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere ring="top-left" bokeh={14}>
        <div className="w-full h-full flex flex-col @xl:flex-row">
          {/* LEFT GUTTER — FUNNEL */}
          <div className="relative overflow-hidden @xl:w-[18%] border-b @xl:border-b-0 @xl:border-r border-[var(--line)] px-5 py-3 @xl:px-7 @xl:py-10 flex flex-col justify-center gap-2 @xl:gap-8">
            {/* A depth cue in the gutter's empty head space. It sits above the
                figures rather than over them — this column is too narrow to
                carry an object beside the numbers. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden @xl:block">
              {/* Positioning lives on this wrapper, never on `Sprite3D` — its
                  own root is `position: relative`, which would win over an
                  `absolute` passed through className and shift the sprite the
                  wrong way. */}
              <div className="absolute right-4 top-[3%] h-[15vh] w-[15vh]">
                <Sprite3D
                  alt=""
                  className="h-full w-full"
                  delay={0.5}
                  depth={26}
                  float={8}
                  glow="#7fc4ff"
                  spin
                  src="/media/operator-pixel-cutout.svg"
                />
              </div>
            </div>

            <div className="relative flex items-center gap-2.5">
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
                style={{ paddingLeft: `${i * 6}px` }}
                className="relative border-l border-[var(--line)] pl-3 @xl:pl-4"
              >
                <Counter
                  className={`${MONO} block text-[var(--cyan)] text-sm @xl:text-3xl`}
                  contentKey={`funnel.rows.${i}.figure`}
                  delay={0.25 + i * 0.16}
                  duration={1.7}
                  text={row.figure}
                />
                <TextContent
                  content={row.label}
                  className={`${MONO} block text-[var(--muted)] text-[7px] @xl:text-[11px] mt-0.5 @xl:mt-2 leading-snug`}
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
              {blocks.tiers.rows.map((row, i) => {
                const on = active === i;
                return (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, delay: 0.2 + i * 0.13 }}
                    className="min-h-0 flex-1 border-b border-[var(--line)]"
                    onPointerEnter={() => setActive(i)}
                    onPointerLeave={() => setActive(null)}
                  >
                    {/* Each band tilts toward the pointer; the selected band also
                        gets its tier tag and a stronger accent edge. `Tilt` takes
                        no padding of its own — the band surface carries it, so the
                        fill still reaches the column edges. */}
                    <Tilt className="h-full w-full" max={3.5} lift={12}>
                      <div
                        className="relative flex h-full min-h-0 w-full flex-col justify-center px-4 py-3 @xl:px-8 @xl:py-6 transition-colors duration-300"
                        style={{
                          background: ["var(--navy-3)", "var(--navy-2)", "var(--navy-1)"][i % 3],
                          borderLeft: `1px solid ${on ? "var(--cyan)" : ACCENTS[i % 3]}`,
                        }}
                      >
                        <div className="flex items-center gap-3 @xl:gap-5">
                          <span
                            className={`${MONO} shrink-0 text-[8px] @xl:text-[15px] transition-colors duration-300 ${
                              on ? "text-[var(--cyan)]" : "text-[var(--steel)]"
                            }`}
                          >
                            {row.tag}
                          </span>
                          <TextContent
                            content={row.name}
                            className="font-condensed font-bold text-white text-[18px] @xl:text-[30px] leading-none tracking-[-0.01em]"
                          />
                        </div>
                        <TextContent
                          content={row.description}
                          className="font-grotesk text-[var(--body)] text-[9px] @xl:text-[15px] mt-1.5 @xl:mt-2.5 leading-snug"
                        />
                        {on ? <Glint delay={0.1} duration={0.9} /> : null}
                      </div>
                    </Tilt>
                  </motion.div>
                );
              })}
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
                    className={`${MONO} block text-[var(--body)] text-[8px] @xl:text-[13px] leading-snug`}
                  />
                </motion.div>
              ))}
            </div>
            <div className="mt-auto border border-[var(--hairline)] px-3 py-2 @xl:px-4 @xl:py-4">
              <TextContent
                content={blocks.targetNote.content}
                data-content-keys={["targetNote"]}
                className={`${MONO} block text-[var(--amber)] text-[8px] @xl:text-[12px] leading-relaxed`}
              />
            </div>
          </div>
        </div>
      </Atmosphere>
    </div>
  );
}
