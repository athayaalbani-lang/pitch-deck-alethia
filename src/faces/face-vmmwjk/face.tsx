import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlethiaScreen, ProductButton, ProductPageHeader, ProductPanel, ProductPill } from "@/components/ui/alethia-screen";
import { Glint, PulseRing, Reveal, Sprite3D, Tilt } from "@/components/ui/anim";

const checkpoints = ["Message arrives", "Inspect", "Verify", "Choose a response", "See the outcome"];

/* Each step keeps the slide's own content: the analyst signals are the same
   two notes throughout, and the phone shows the same fictional message. What
   changes is only which checkpoint is active, so a learner can walk the flow. */
const steps = [
  { heading: "Message arrives", note: "A simulated delivery message is designed to make you act before you have time to check." },
  { heading: "Inspect", note: "A display name does not prove the message came from a courier. Read the sender and the link before anything else." },
  { heading: "Verify", note: "Compare the link with the courier's official app or site. Use a channel you already trust, not one the message supplies." },
  { heading: "Choose a response", note: "Pause before acting. The pressure in the message is the signal being tested." },
  { heading: "See the outcome", note: "Review the clues behind each decision. This is feedback, not a certification score." },
];

export default function CourierSimulationFace() {
  const [step, setStep] = useState(0);

  return (
    <AlethiaScreen active="training" footer="ALETHIA · SAFE SIMULATION · NO REAL DATA IS COLLECTED">
      <div className="flex h-full min-h-0 flex-col gap-3 @xl:gap-5">
        <Reveal as="div" blur={4} y={10}>
          <ProductPageHeader
            title="Courier message"
            description="A simulated delivery message is designed to make you act before you have time to check. Inspect the sender and link, verify through an official channel, then choose a response."
            action={<ProductPill tone="signal">Module 01 · SMS phishing</ProductPill>}
          />
        </Reveal>

        {/* Stepper — the bar fills to the active step, and each stop is a
            button so the flow can be walked forwards and back. */}
        <Reveal as="ol" className="grid shrink-0 grid-cols-5 border-y border-[#263544]" index={1} y={10}>
          {checkpoints.map((checkpoint, index) => {
            const reached = index <= step;
            const active = index === step;
            return (
              <li className="relative" key={checkpoint}>
                <button
                  type="button"
                  onClick={() => setStep(index)}
                  aria-current={active ? "step" : undefined}
                  className={`w-full border-b-2 px-1.5 py-2 text-left font-mono text-[5px] transition-colors @xl:px-3 @xl:py-3 @xl:text-[9px] ${
                    reached ? "border-[#a6e86b] text-[#a6e86b]" : "border-transparent text-[#8191a1] hover:text-[#c2ccd6]"
                  }`}
                >
                  <span className="mr-1 @xl:mr-2">{index + 1}</span>
                  {checkpoint}
                  {active ? (
                    <motion.span
                      layoutId="courier-step-underline"
                      className="absolute inset-x-0 -bottom-px h-[2px] bg-[#a6e86b]"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
          <motion.span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px bg-[#a6e86b]/45"
            style={{ width: `${((step + 1) / checkpoints.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
        </Reveal>

        <div className="grid min-h-0 flex-1 gap-3 @xl:grid-cols-[.72fr_1.05fr_1.05fr] @xl:gap-5">
          <Reveal className="flex min-h-0 flex-col" index={2} y={14}>
            <ProductPanel className="flex h-full min-h-0 flex-col">
              <div className="flex items-center justify-between gap-2 border-b border-[#263544] pb-2 @xl:pb-4">
                <h2 className="font-mono text-[7px] font-bold uppercase tracking-[.14em] text-[#a6e86b] @xl:text-[10px]">Simulation flow</h2>
                <ProductPill>5 steps</ProductPill>
              </div>
              <div className="mt-2 flex-1 space-y-2 @xl:mt-4 @xl:space-y-4">
                {checkpoints.map((item, index) => {
                  const reached = index <= step;
                  const active = index === step;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStep(index)}
                      className={`flex w-full items-center gap-2 rounded-sm text-left transition-opacity @xl:gap-3 ${reached ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
                    >
                      <span className="relative grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-[6px] @xl:h-8 @xl:w-8 @xl:text-[9px]">
                        {active ? <PulseRing tone="#a6e86b" /> : null}
                        <span className={reached ? "border-[#a6e86b] bg-[#a6e86b] text-[#0b1420]" : "border-[#364657] text-[#8191a1]"}>
                          {index + 1}
                        </span>
                      </span>
                      <span className={`text-[6px] @xl:text-[9px] ${active ? "font-semibold text-[#f2f6f9]" : "text-[#8191a1]"}`}>{item}</span>
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-[#263544] pt-2 @xl:pt-4">
                <p className="font-mono text-[5px] uppercase tracking-[.12em] text-[#8191a1] @xl:text-[8px]">Safe simulation</p>
                <p className="mt-1 text-[6px] leading-relaxed text-[#a6e86b] @xl:text-[9px]">No real parcel, courier, or personal data is involved.</p>
              </div>
            </ProductPanel>
          </Reveal>

          <Reveal className="flex min-h-0 flex-col" index={3} y={16}>
            <Tilt className="flex h-full min-h-0 flex-col" max={4} lift={8}>
              <ProductPanel className="flex h-full min-h-0 flex-col">
                <div className="relative mx-auto flex w-full max-w-[480px] flex-1 flex-col overflow-hidden border border-[#364657] bg-[#0a111a] shadow-[0_12px_40px_rgba(0,0,0,.35)]">
                  <div className="flex items-center justify-between border-b border-[#263544] bg-[#111c28] px-3 py-2 @xl:px-5 @xl:py-3">
                    <span className="font-mono text-[6px] uppercase text-[#8191a1] @xl:text-[9px]">SMS · Today, 09:41</span>
                    <span className="font-mono text-[6px] text-[#f2f6f9] @xl:text-[9px]">ParcelPath Desk</span>
                  </div>
                  <div className="flex h-full flex-col p-3 @xl:p-6">
                    <motion.div
                      className="max-w-[90%] border border-[#263544] bg-[#161e27] p-2.5 @xl:p-5"
                      animate={step >= 1 ? { opacity: 1, x: 0 } : { opacity: 0.55, x: -8 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="text-[8px] leading-relaxed @xl:text-sm">Your parcel is waiting at a sorting centre.</p>
                      <p className="mt-2 text-[8px] leading-relaxed @xl:text-sm">Confirm before 6:00 PM or the parcel will be returned.</p>
                      <p className="mt-2 rounded border border-[#edbd67]/30 bg-[#edbd67]/[.05] p-2 font-mono text-[7px] text-[#edbd67] @xl:mt-4 @xl:text-[11px]">
                        parcel-check[.]example/confirm
                      </p>
                    </motion.div>
                    <p className="mt-2 font-mono text-[5px] uppercase tracking-[.1em] text-[#8191a1] @xl:mt-4 @xl:text-[8px]">Fictional message · link safely defanged</p>

                    {/* The active step's guidance, drawn from the slide's own
                        copy. Nothing new is introduced per step. */}
                    <div className="mt-2 min-h-[3.2rem] @xl:mt-4 @xl:min-h-[4.2rem]">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={step}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.3 }}
                          className="text-[7px] leading-relaxed text-[#c2ccd6] @xl:text-[11px]"
                        >
                          {steps[step].note}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    <div className="mt-auto grid gap-1.5 pt-3 @xl:gap-2 @xl:pt-6">
                      <button
                        type="button"
                        onClick={() => setStep((step + 1) % checkpoints.length)}
                        className="inline-flex min-h-7 items-center justify-center rounded-[var(--rw-radius)] border border-[#a6e86b] bg-[#a6e86b] px-3 font-mono text-[8px] font-bold uppercase tracking-[.08em] text-[#0d1a2b] transition hover:bg-[#b7f27d] @xl:min-h-10 @xl:px-5 @xl:text-[11px]"
                      >
                        {step === checkpoints.length - 1 ? "Restart the practice" : "Inspect message"}
                      </button>
                      <span className="inline-flex min-h-7 items-center justify-center border border-[#263544] px-3 font-mono text-[6px] text-[#8191a1] @xl:min-h-10 @xl:text-[9px]">
                        Start the 5-step practice
                      </span>
                    </div>
                  </div>
                  <Glint delay={0.6} />
                </div>
              </ProductPanel>
            </Tilt>
          </Reveal>

          <Reveal className="flex min-h-0 flex-col" index={4} y={14}>
            <ProductPanel className="flex h-full min-h-0 flex-col">
              <div className="flex items-start justify-between gap-3 border-b border-[#263544] pb-2 @xl:pb-4">
                <div>
                  <h2 className="font-mono text-[7px] font-bold uppercase tracking-[.14em] text-[#a6e86b] @xl:text-[10px]">Analyst notes</h2>
                  <p className="mt-1 text-[6px] text-[#8191a1] @xl:text-[9px]">Signals the learner can inspect</p>
                </div>
                <Sprite3D alt="" className="h-8 w-8 shrink-0 @xl:h-12 @xl:w-12" depth={14} float={4} spin src="/media/leveltwo.webp" />
              </div>
              <div className="mt-2 space-y-2 @xl:mt-4 @xl:space-y-4">
                {[
                  { title: "Sender is not verified", body: "A display name does not prove the message came from a courier." },
                  { title: "Domain does not match", body: "Compare the link with the courier's official app or site." },
                ].map((note, index) => (
                  <motion.div
                    key={note.title}
                    className="border-l-2 border-l-[#edbd67] bg-[#0b1420] p-2 @xl:p-4"
                    animate={step >= index + 1 ? { opacity: 1, x: 0 } : { opacity: 0.5, x: -6 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                  >
                    <p className="font-mono text-[6px] text-[#edbd67] @xl:text-[9px]">{note.title}</p>
                    <p className="mt-1 text-[6px] leading-relaxed text-[#c2ccd6] @xl:text-[10px]">{note.body}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-auto border-t border-[#263544] pt-2 @xl:pt-4">
                <p className="font-mono text-[5px] uppercase tracking-[.1em] text-[#8191a1] @xl:text-[8px]">Choose a response</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5 @xl:mt-3">
                  <ProductPill>Open link</ProductPill>
                  <ProductPill tone="signal">Verify officially</ProductPill>
                  <ProductPill>Report &amp; delete</ProductPill>
                </div>
              </div>
            </ProductPanel>
          </Reveal>
        </div>
      </div>
    </AlethiaScreen>
  );
}
