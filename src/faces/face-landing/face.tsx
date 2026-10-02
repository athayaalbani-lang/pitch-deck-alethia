import React, { useRef } from "react";
import { useInView } from "motion/react";
import { LandingMock } from "./components/landing-mock";

const landingAreas = [
  { label: "01 / PRACTISE", value: "Cyber attack simulations" },
  { label: "02 / PROGRESS", value: "Progress & streak tracking" },
  { label: "03 / COMMUNITY", value: "Report hub & operator profile" },
];

export default function LandingAccessFace() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });

  return (
    <div ref={root} className="h-full w-full bg-[var(--space-base)] p-2 @xl:p-5 font-body text-[var(--ink)]" style={{ backgroundImage: "radial-gradient(ellipse at 16% 0%, rgba(166,232,107,.07), transparent 36%), radial-gradient(ellipse at 90% 100%, rgba(48,83,112,.15), transparent 42%)" }}>
      <div className="mx-auto flex h-full w-full max-w-[1880px] flex-col overflow-hidden border border-[var(--space-line)] bg-[var(--space-panel)] shadow-[0_28px_100px_rgba(0,0,0,.48),inset_0_1px_0_rgba(230,237,244,.04)]">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--space-line)] bg-[var(--space-panel)] px-4 py-2.5 @xl:px-10 @xl:py-5">
          <div className="flex items-center gap-2.5 @xl:gap-4">
            <span aria-hidden="true" className="grid h-7 w-7 @xl:h-11 @xl:w-11 place-items-center border border-[var(--lime)]/60 bg-[var(--lime)]/10 font-mono text-[11px] @xl:text-lg font-bold text-[var(--lime)]">A_</span>
            <span className="font-mono text-[10px] @xl:text-base font-bold tracking-[.2em]">ALETHIA</span>
          </div>
          <div className="flex items-center gap-2 @xl:gap-4">
            <span className="hidden @xl:block font-mono text-[10px] uppercase tracking-[.12em] text-[var(--ink-muted)]">Safe, fictional practice</span>
            <span className="border border-[var(--lime)]/60 bg-[var(--lime)] px-3 py-1.5 @xl:px-5 @xl:py-2.5 font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.08em] text-[var(--space-raised)]">Enter Alethia ↗</span>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col p-3 @xl:p-6">
          <div className="mb-2 @xl:mb-4 flex shrink-0 items-center justify-between gap-3 font-mono text-[6px] @xl:text-[9px] uppercase tracking-[.12em] text-[var(--ink-muted)]">
            <span>Explore the Alethia worlds</span>
            <span>Landing page · product entry</span>
          </div>
          <div className="min-h-0 flex-1">
            <LandingMock
              active={inView}
              headline="The state of not being hidden."
              cta="Enter to start practising"
              chips={landingAreas}
            />
          </div>
        </main>

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-[var(--space-line)] bg-[var(--space-base)] px-4 py-2 @xl:px-10 @xl:py-3 font-mono text-[6px] @xl:text-[9px] tracking-[.08em] text-[var(--ink-muted)]">
          <span>SMS phishing · marketplace social engineering · community reports</span>
          <span>No real attacks or personal data</span>
        </footer>
      </div>
    </div>
  );
}
