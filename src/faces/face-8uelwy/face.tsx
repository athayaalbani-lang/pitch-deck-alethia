import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { blocks } from "./face.content.json";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Overline, Reveal, Ring } from "@/components/ui/8bit";
import { Capsule } from "@/components/ui/sbs";
import { LevelSprites } from "@/components/ui/pixel-art";
import { TextContent } from "@/components/ui/text-content";

const MONO = "font-grotesk uppercase tracking-[0.18em]";

const NOTES = [
  { t: "09:14", v: "Sender domain registered 3 days ago" },
  { t: "09:19", v: "Link host differs from display host" },
  { t: "09:31", v: "Confirmed against source" },
];

export default function ReportHubFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });
  const [step, setStep] = useState(0);
  const [verdict, setVerdict] = useState<"valid" | "invalid" | null>(null);
  const [revealed, setRevealed] = useState(false);

  const steps = blocks.steps.rows;
  const current = steps[step];
  const validPct = verdict === "valid" ? 78 : verdict === "invalid" ? 22 : 50;


  return (
    <div ref={root} className="w-full h-full font-body">
      <Atmosphere ghost={current.step} ring="bottom-right">
        <div className="w-full h-full flex flex-col @xl:flex-row">
          {/* LEFT — oversized index + title */}
          <div className="@xl:w-[34%] shrink-0 border-b @xl:border-b-0 @xl:border-r border-[var(--line)] px-6 @xl:px-14 py-5 @xl:py-10 flex flex-col">
            <div className="flex items-center gap-3">
              <Ring size={20} thickness={0.4} color="var(--cyan)" />
              <Overline>
                <TextContent content={blocks.label.content} data-content-keys={["label"]} />
              </Overline>
            </div>

            {/* huge step number */}
            <div className="mt-auto pt-4 @xl:pt-0">
              <Reveal shown={inView} key={current.step}>
                <div className="font-condensed font-bold text-[var(--cyan)] text-[76px] @xl:text-[190px] leading-[0.78] tracking-[-0.03em]">
                  {current.step}
                </div>
              </Reveal>
              <Reveal shown={inView} delay={120}>
                <TextContent
                  content={blocks.title.content}
                  data-content-keys={["title"]}
                  className="font-condensed font-semibold text-white text-[22px] @xl:text-[42px] leading-[1.0] tracking-[-0.01em] mt-3 @xl:mt-5"
                />
              </Reveal>
            </div>
          </div>

          {/* RIGHT — the moving part */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Step selector: the four capsules from the reference map. */}
            <div className="flex flex-wrap items-center gap-2 @xl:gap-4 px-6 @xl:px-14 pt-5 @xl:pt-9">
              {steps.map((s, i) => (
                <Capsule
                  key={s.id}
                  size="md"
                  tilt={i % 2 === 0 ? -2.5 : 2}
                  dimmed={step !== i}
                  onClick={() => {
                    setStep(i);
                    setVerdict(null);
                  }}
                >
                  {String(i + 1).padStart(2, "0")} · {s.verb}
                </Capsule>
              ))}

              {/* This slide's verdict line is "Rank follows the ledger", so the
                  ladder gets represented. Parked at the end of the selector row
                  where there was dead space. */}
              <motion.div
                className="ml-auto"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <LevelSprites size={56} gap={10} />
              </motion.div>
            </div>

            {/* headline + stage as one centred block */}
            <div className="flex-1 min-h-0 flex flex-col justify-center gap-6 @xl:gap-12 px-6 @xl:px-14 py-6 @xl:py-10">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
              >
                <TextContent
                  content={current.title}
                  data-content-keys={[`steps.rows.${step}.title`]}
                  className="font-condensed font-semibold text-white text-[28px] @xl:text-[68px] leading-[0.96] tracking-[-0.02em]"
                />
                <TextContent
                  content={current.line}
                  data-content-keys={[`steps.rows.${step}.line`]}
                  className="font-grotesk text-[var(--muted)] text-[12px] @xl:text-[21px] mt-2 @xl:mt-5"
                />
              </motion.div>

              {/* the interactive stage */}
              <div className="flex flex-col gap-4 @xl:gap-7">
              {step === 0 && (
                <div className="flex flex-col gap-4 @xl:gap-7">
                  <div className="flex h-8 @xl:h-16 overflow-hidden">
                    <motion.div
                      className="bg-[var(--cyan)]"
                      animate={{ width: revealed ? "30%" : "18%" }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <div className="flex-1 bg-[var(--navy-3)]" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <Capsule size="sm" tilt={-1.5} glow={false}>
                      Public · signal + evidence
                    </Capsule>
                    <Capsule
                      size="sm"
                      tilt={1.5}
                      onClick={() => setRevealed((r) => !r)}
                    >
                      {revealed ? "Seal it" : "Reveal name"}
                    </Capsule>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-4 @xl:gap-7">
                  <div className="flex h-8 @xl:h-16 overflow-hidden">
                    <motion.div
                      className="bg-[var(--cyan)]"
                      animate={{ width: `${validPct}%` }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <div className="flex-1 bg-[var(--navy-3)]" />
                  </div>
                  <div className="flex items-center gap-3 @xl:gap-6">
                    {["valid", "invalid"].map((v, i) => (
                      <Capsule
                        key={v}
                        size="md"
                        tilt={i === 0 ? -2 : 2}
                        dimmed={verdict !== v}
                        glow
                        onClick={() => setVerdict(v as "valid" | "invalid")}
                      >
                        {blocks.verdict.rows[i].label}
                      </Capsule>
                    ))}
                    <span
                      className={`${MONO} text-[var(--steel)] text-[9px] @xl:text-[16px] tabular-nums w-[56px] @xl:w-[92px] text-right`}
                    >
                      {validPct}%
                    </span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col">
                  {NOTES.map((n, i) => (
                    <motion.div
                      key={n.t}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.09 }}
                      className="flex items-baseline gap-3 @xl:gap-10 border-b border-[var(--line)] py-3 @xl:py-6"
                    >
                      <span
                        className={`${MONO} text-[var(--cyan)] text-[9px] @xl:text-[16px] tabular-nums`}
                      >
                        {n.t}
                      </span>
                      <span
                        className={`${MONO} text-[var(--body)] text-[9px] @xl:text-[20px] truncate`}
                      >
                        {n.v}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4 @xl:gap-7">
                  <div className="flex gap-2 @xl:gap-4">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="h-6 @xl:h-14 flex-1"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        style={{
                          background: i <= 2 ? "var(--cyan)" : "var(--navy-3)",
                          transformOrigin: "left",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <span className={`${MONO} text-[var(--cyan)] text-[9px] @xl:text-[17px]`}>
                      Investigator · 320
                    </span>
                    <span className={`${MONO} text-[var(--steel)] text-[9px] @xl:text-[17px]`}>
                      Guardian · 550
                    </span>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </Atmosphere>
    </div>
  );
}
