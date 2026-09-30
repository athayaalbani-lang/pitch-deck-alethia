import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { TextContent } from "@/components/ui/text-content";
import { blocks } from "./face.content.json";
import { controls } from "./face.controls.json";
import { LandingMock } from "./components/landing-mock";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Capsule } from "@/components/ui/sbs";
import { Ring } from "@/components/ui/8bit";

const MONO = "font-grotesk uppercase tracking-[0.18em]";

export default function LandingAccessFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });
  const [tab, setTab] = useState(0);
  const showChips = controls.showAnnotations?.value ?? true;

  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere ghost="IN" ring="top-left" bokeh={14}>
      <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0 flex flex-col @xl:flex-row">
        {/* LEFT 58% — LANDING */}
        <div className="@xl:w-[58%] min-h-0 border-b @xl:border-b-0 @xl:border-r border-[var(--line)] p-3 @xl:p-8 flex flex-col gap-2 @xl:gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Ring size={14} thickness={0.5} color="var(--steel)" />
              <TextContent
                content={blocks.badge.content}
                data-content-keys={["badge"]}
                className={`${MONO} text-[var(--steel)] text-[8px] @xl:text-sm`}
              />
            </div>
            <Capsule size="sm" tilt={2} glow={false}>
              <TextContent
                content={blocks.routeChip.content}
                data-content-keys={["routeChip"]}
              />
            </Capsule>
          </div>
          <div className="flex-1 min-h-0">
            <LandingMock
              active={inView}
              headline={blocks.landingHeadline.content}
              cta={blocks.landingCta.content}
              chips={showChips
                ? blocks.isleChips.rows.map((r) => ({
                    label: r.label,
                    value: r.value,
                  }))
                : []}
            />
          </div>
        </div>

        {/* RIGHT 42% */}
        <div className="@xl:w-[42%] flex flex-col min-h-0">
          {/* LOGIN CARD */}
          <div className="border-b border-[var(--line)] px-4 py-3 @xl:px-10 @xl:py-8">
            <div className="flex gap-4 @xl:gap-8 border-b border-[var(--line)]">
              {blocks.authTabs.rows.map((row, i) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => setTab(i)}
                  className="relative pb-1.5 @xl:pb-3"
                >
                  <TextContent
                    content={row.label}
                    data-content-keys={[`authTabs.rows.${i}.label`]}
                    className={`${MONO} text-[9px] @xl:text-base ${tab === i ? "text-white" : "text-[var(--steel)]"}`}
                  />
                  {tab === i && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute left-0 right-0 -bottom-px h-[2px] bg-[var(--cyan)]"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-3 @xl:mt-6 flex flex-col gap-2 @xl:gap-4">
              {blocks.authFields.rows.map((row, i) => (
                <div
                  key={row.id}
                  className="bg-[var(--navy-1)] border border-[var(--line)] px-3 @xl:px-5 py-2 @xl:py-4"
                >
                  <TextContent
                    content={row.label}
                    data-content-keys={[`authFields.rows.${i}.label`]}
                    className={`${MONO} text-[var(--steel)] text-[7px] @xl:text-[11px]`}
                  />
                  <TextContent
                    content={row.value}
                    data-content-keys={[`authFields.rows.${i}.value`]}
                    className="font-mono text-[var(--body)] text-[10px] @xl:text-xl mt-0.5 @xl:mt-1.5"
                  />
                </div>
              ))}
              <div className="bg-[var(--blue)] border border-[var(--cyan)] px-3 @xl:px-5 py-2 @xl:py-4 text-center">
                <TextContent
                  content={
                    tab === 0
                      ? blocks.authActionSignIn.content
                      : blocks.authActionRegister.content
                  }
                  data-content-keys={
                    tab === 0 ? ["authActionSignIn"] : ["authActionRegister"]
                  }
                  className={`${MONO} text-[var(--cyan)] text-[10px] @xl:text-lg`}
                />
              </div>
            </div>
          </div>

          {/* SECURITY SPEC */}
          <div className="flex-1 min-h-0 px-4 py-3 @xl:px-10 @xl:py-7 flex flex-col">
            <TextContent
              content={blocks.specHeading.content}
              data-content-keys={["specHeading"]}
              className={`${MONO} text-[var(--cyan)] text-[8px] @xl:text-sm mb-1.5 @xl:mb-4`}
            />
            <div className="flex flex-col">
              {blocks.spec.rows.map((row, i) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex items-baseline justify-between gap-3 py-1 @xl:py-2.5 border-b border-[var(--line)]"
                >
                  <TextContent
                    content={row.key}
                    data-content-keys={[`spec.rows.${i}.key`]}
                    className={`${MONO} text-[var(--muted)] text-[7px] @xl:text-[12px] shrink-0`}
                  />
                  <TextContent
                    content={row.value}
                    data-content-keys={[`spec.rows.${i}.value`]}
                    className="font-grotesk text-[var(--body)] text-[8px] @xl:text-[15px] text-right"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAND */}
      <div className="border-t border-[var(--line)] grid grid-cols-3">
        {blocks.claims.rows.map((row, i) => (
          <TextContent
            key={row.id}
            content={row.label}
            data-content-keys={[`claims.rows.${i}.label`]}
            className={`${MONO} text-[var(--ice)] text-[7px] @xl:text-[19px] px-2 @xl:px-10 py-2 @xl:py-5 border-l first:border-l-0 border-[var(--line)]`}
          />
        ))}
      </div>
      </div>
      </Atmosphere>
    </div>
  );
}
