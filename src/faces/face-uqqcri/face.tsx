import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Atmosphere } from "@/components/ui/atmosphere";
import { MaskReveal } from "@/components/ui/motion";
import { navigateTo } from "@/utils/face-navigation";
import { NodeGraph } from "./components/node-graph";

const destinations = [
  { number: "01", label: "Practice modules", faceId: "face-1ecenb" },
  { number: "02", label: "Community reports", faceId: "face-8uelwy" },
  { number: "03", label: "Practice insights", faceId: "face-9sa50d" },
];

export default function OpeningFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.3 });

  return (
    <div ref={root} className="h-full w-full font-body text-[var(--ice)]">
      <Atmosphere ghost="A" ring="bottom-right" bokeh={16}>
        <div className="relative flex h-full w-full flex-col px-5 py-4 @xl:px-14 @xl:py-8">
          <header className="flex shrink-0 items-center justify-between border-b border-[var(--line)] pb-3 @xl:pb-5">
            <div className="flex items-center gap-3 @xl:gap-4">
              <span className="grid h-8 w-8 @xl:h-12 @xl:w-12 place-items-center border border-[#a6e86b]/45 bg-[#a6e86b]/[.08] font-mono text-xs @xl:text-xl font-bold text-[#a6e86b] shadow-[0_0_24px_rgba(166,232,107,.12)]">A_</span>
              <span className="font-mono text-[10px] @xl:text-sm font-bold tracking-[.22em]">ALETHIA</span>
            </div>
            <span className="font-mono text-[7px] @xl:text-[10px] uppercase tracking-[.16em] text-[var(--steel)]">Product walkthrough · Web prototype</span>
          </header>

          <main className="flex min-h-0 flex-1 flex-col @xl:flex-row @xl:items-center gap-5 @xl:gap-12 py-5 @xl:py-8">
            <section className="flex min-h-0 flex-1 flex-col justify-center @xl:w-[56%] @xl:flex-none">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="font-mono text-[7px] @xl:text-[11px] uppercase tracking-[.2em] text-[#a6e86b]"
              >
                A safe place to practise
              </motion.p>
              <MaskReveal>
                <motion.h1
                  initial={{ opacity: 0, filter: "blur(12px)", y: 18 }}
                  animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
                  transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                  className="mt-2 font-condensed text-[72px] @xl:text-[172px] font-bold leading-[.78] tracking-[-.055em] text-white"
                >
                  ALETHIA
                </motion.h1>
              </MaskReveal>
              <div className="mt-5 @xl:mt-9 h-px w-full max-w-[880px] bg-gradient-to-r from-[#a6e86b] via-[#a6e86b]/30 to-transparent" />
              <h2 className="mt-4 @xl:mt-7 max-w-[920px] font-heading text-[22px] @xl:text-[42px] font-semibold leading-[1.08] tracking-[-.035em] text-[var(--ice)]">
                Learn the trick before it tricks you.
              </h2>
              <p className="mt-3 @xl:mt-5 max-w-[760px] text-[9px] @xl:text-[16px] leading-relaxed text-[var(--body)]">
                Practise spotting social engineering in fictional scenarios, then review the clues behind each decision.
              </p>
              <button
                type="button"
                onClick={() => navigateTo({ faceId: "face-landing" })}
                className="mt-5 @xl:mt-8 inline-flex w-fit items-center gap-4 border border-[#a6e86b] bg-[#a6e86b] px-4 py-2.5 @xl:px-6 @xl:py-4 font-mono text-[8px] @xl:text-[12px] font-bold uppercase tracking-[.08em] text-[#07101c] shadow-[0_0_30px_rgba(166,232,107,.12)] transition hover:bg-[#b7f27d]"
              >
                Explore the 3D landing <span aria-hidden="true">↗</span>
              </button>
            </section>

            <section className="min-h-0 flex-1 @xl:w-[44%] @xl:flex-none" aria-label="Alethia product areas">
              <NodeGraph
                active={inView}
                nodes={["Practice", "Progress", "Reports"]}
                adminLabel="Admin tools"
              />
            </section>
          </main>

          <nav aria-label="Explore product screens" className="grid shrink-0 grid-cols-3 border-y border-[var(--line)]">
            {destinations.map((item, index) => (
              <button
                key={item.number}
                type="button"
                onClick={() => navigateTo({ faceId: item.faceId })}
                className={`group flex min-w-0 items-center gap-2 @xl:gap-4 px-2 py-2.5 @xl:px-6 @xl:py-4 text-left transition hover:bg-[#a6e86b]/[.04] ${index > 0 ? "border-l border-[var(--line)]" : ""}`}
              >
                <span className="font-mono text-[7px] @xl:text-[11px] text-[#a6e86b]">{item.number}</span>
                <span className="truncate text-[7px] @xl:text-[13px] font-medium text-[var(--body)] group-hover:text-white">{item.label}</span>
                <span className="ml-auto hidden @xl:block font-mono text-[11px] text-[var(--steel)] transition group-hover:translate-x-1 group-hover:text-[#a6e86b]">↗</span>
              </button>
            ))}
          </nav>
        </div>
      </Atmosphere>
    </div>
  );
}
