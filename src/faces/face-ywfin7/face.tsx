import React from "react";
import { motion } from "motion/react";
import { Atmosphere } from "@/components/ui/atmosphere";
import { MaskReveal } from "@/components/ui/motion";
import { navigateTo } from "@/utils/face-navigation";

const nextSteps = [
  { label: "Training modules", note: "Explore the guided practice path", faceId: "face-1ecenb" },
  { label: "Community reports", note: "Review shared examples", faceId: "face-8uelwy" },
  { label: "Practice insights", note: "See account-based progress", faceId: "face-9sa50d" },
];

export default function ClosingFace() {
  return (
    <div className="h-full w-full font-body text-[var(--ice)]">
      <Atmosphere ghost="GO" ring="center" bokeh={18}>
        <div className="relative flex h-full w-full flex-col px-5 py-4 @xl:px-14 @xl:py-8">
          <header className="flex shrink-0 items-center justify-between border-b border-[var(--line)] pb-3 @xl:pb-5">
            <div className="flex items-center gap-3 @xl:gap-4">
              <span className="grid h-8 w-8 @xl:h-12 @xl:w-12 place-items-center border border-[#a6e86b]/45 bg-[#a6e86b]/[.08] font-mono text-xs @xl:text-xl font-bold text-[#a6e86b]">A_</span>
              <span className="font-mono text-[10px] @xl:text-sm font-bold tracking-[.22em]">ALETHIA</span>
            </div>
            <span className="font-mono text-[7px] @xl:text-[10px] uppercase tracking-[.16em] text-[var(--steel)]">Current web prototype</span>
          </header>

          <main className="flex min-h-0 flex-1 flex-col items-center justify-center py-5 @xl:py-8 text-center">
            <MaskReveal>
              <motion.h1
                initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                className="font-condensed text-[68px] @xl:text-[160px] font-black leading-[.82] tracking-[-.05em] text-white"
              >
                ALETHIA
              </motion.h1>
            </MaskReveal>
            <p className="mt-4 @xl:mt-7 max-w-[1060px] font-heading text-[18px] @xl:text-[34px] font-medium leading-tight tracking-[-.025em] text-[var(--body)]">
              A safe place to practise spotting social engineering.
            </p>
            <p className="mt-2 @xl:mt-4 font-mono text-[7px] @xl:text-[10px] uppercase tracking-[.14em] text-[#a6e86b]">
              Fictional scenarios · Learner progress · Community reports
            </p>

            <nav aria-label="Continue exploring Alethia" className="mt-6 @xl:mt-12 grid w-full max-w-[1440px] grid-cols-1 @xl:grid-cols-3 border-y border-[var(--line)] text-left">
              {nextSteps.map((step, index) => (
                <button
                  key={step.faceId}
                  type="button"
                  onClick={() => navigateTo({ faceId: step.faceId })}
                  className={`group flex items-center justify-between gap-4 px-3 py-3 @xl:px-7 @xl:py-6 text-left transition hover:bg-[#a6e86b]/[.04] ${index > 0 ? "border-t @xl:border-t-0 @xl:border-l border-[var(--line)]" : ""}`}
                >
                  <span>
                    <span className="block font-mono text-[6px] @xl:text-[9px] uppercase tracking-[.16em] text-[#a6e86b]">0{index + 1}</span>
                    <span className="mt-1 block text-[9px] @xl:text-[15px] font-semibold text-[var(--ice)]">{step.label}</span>
                    <span className="mt-1 block text-[7px] @xl:text-[11px] text-[var(--steel)]">{step.note}</span>
                  </span>
                  <span className="font-mono text-sm @xl:text-lg text-[var(--steel)] transition group-hover:translate-x-1 group-hover:text-[#a6e86b]">↗</span>
                </button>
              ))}
            </nav>
          </main>

          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--line)] pt-3 @xl:pt-5 font-mono text-[6px] @xl:text-[9px] uppercase tracking-[.1em] text-[var(--steel)]">
            <span>Practice happens in a guided, fictional environment</span>
            <span className="text-[#a6e86b]/80">ALETHIA · WEB PROTOTYPE</span>
          </footer>
        </div>
      </Atmosphere>
    </div>
  );
}
