import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Atmosphere } from "@/components/ui/atmosphere";
import { MaskReveal } from "@/components/ui/motion";
import { PixelHero } from "@/components/ui/rewind";
import { TextContent } from "@/components/ui/text-content";
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

          {/* Centred hero. The node graph runs full-bleed behind everything, and
              the mascot holds the centre of the frame with the headline above
              it and the call to action below — the reference's composition. */}
          <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center text-center">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <NodeGraph
                active={inView}
                nodes={["Practice", "Progress", "Reports"]}
                adminLabel="Admin tools"
                fill
                dim={0.45}
              />
            </div>

            <div className="relative flex w-full flex-col items-center">
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
                  className="mt-1 font-condensed text-[56px] @xl:text-[132px] font-bold leading-[.78] tracking-[-.055em] text-white"
                >
                  ALETHIA
                </motion.h1>
              </MaskReveal>

              <div className="mt-2.5 @xl:mt-4 h-px w-full max-w-[880px] bg-gradient-to-r from-transparent via-[#a6e86b]/70 to-transparent" />

              <h2 className="mt-2.5 @xl:mt-4 max-w-[980px] font-heading text-[19px] @xl:text-[38px] font-semibold leading-[1.08] tracking-[-.035em] text-[var(--ice)]">
                The state of not being hidden.
              </h2>

              {/* The operator mascot — the deck's 3D element, held at the centre
                  of the frame. The wrapper is a fixed height because `PixelHero`
                  reserves its whole square box regardless of the scale applied. */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
                className="flex h-[190px] @xl:h-[500px] w-full items-center justify-center"
              >
                <div className="scale-[0.5] @xl:scale-[1.02]">
                  <PixelHero size={700} interactive={inView} spin={300} />
                </div>
              </motion.div>

              <button
                type="button"
                onClick={() => navigateTo({ faceId: "face-landing" })}
                className="mt-1 @xl:mt-2 inline-flex items-center gap-4 border border-[#a6e86b] bg-[#a6e86b] px-4 py-2.5 @xl:px-6 @xl:py-4 font-mono text-[8px] @xl:text-[12px] font-bold uppercase tracking-[.08em] text-[#07101c] shadow-[0_0_30px_rgba(166,232,107,.12)] transition hover:bg-[#b7f27d]"
              >
                Explore the 3D landing <span aria-hidden="true">↗</span>
              </button>
            </div>
          </main>

          <nav
            aria-label="Explore product screens"
            className="grid shrink-0 grid-cols-1 border-y border-[var(--line)] @xl:grid-cols-[1.15fr_repeat(3,minmax(0,0.62fr))]"
          >
            <TextContent
              content="Practise spotting social engineering in fictional scenarios, then review the clues behind each decision."
              className="self-center px-2 py-2 @xl:px-6 @xl:py-4 text-[8px] @xl:text-[14px] leading-relaxed text-[var(--steel)]"
            />
            {destinations.map((item) => (
              <button
                key={item.number}
                type="button"
                onClick={() => navigateTo({ faceId: item.faceId })}
                className="group flex min-w-0 items-center gap-2 @xl:gap-4 border-t border-[var(--line)] px-2 py-2.5 @xl:border-l @xl:border-t-0 @xl:px-6 @xl:py-4 text-left transition hover:bg-[#a6e86b]/[.04]"
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