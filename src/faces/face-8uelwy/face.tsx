import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlethiaScreen, ProductButton, ProductPageHeader, ProductPanel, ProductPill } from "@/components/ui/alethia-screen";
import { Glint, Reveal, Tilt } from "@/components/ui/anim";

/* The three example reports already on this slide. Each carries the detail
   fields the right-hand panel shows, so selecting a row reveals its own
   context rather than a fixed one. */
const sampleReports = [
  {
    title: "Example · Delivery message asks for a fee",
    meta: "SMS · phishing pattern",
    state: "Queued for review",
    tone: "warning" as const,
    channel: "SMS message",
    pattern: "Urgent payment request",
    context:
      "Example only: inspect the sender and link, then verify through the courier's official channel before responding.",
    verdict: "Queued for investigator review",
    signals: ["Sender not verified", "Domain does not match courier", "Deadline pressure"],
  },
  {
    title: "Example · Marketplace seller moves chat off-platform",
    meta: "Marketplace · social engineering",
    state: "Reviewed",
    tone: "signal" as const,
    channel: "Marketplace chat",
    pattern: "Off-platform channel change",
    context:
      "Example only: a trusted conversation can still end somewhere with no record. Check the request on the platform itself.",
    verdict: "Reviewed · pattern confirmed",
    signals: ["Channel changed", "Payment requested off-platform", "Account pressure"],
  },
  {
    title: "Example · Unexpected document attachment",
    meta: "Email · risky file",
    state: "Queued for review",
    tone: "warning" as const,
    channel: "Email attachment",
    pattern: "Unexpected file from a known sender",
    context:
      "Example only: check the source, context, and file details before deciding whether to open it.",
    verdict: "Queued for investigator review",
    signals: ["Attachment type unexpected", "Sender display name reused", "No prior thread"],
  },
];

export default function ReportHubFace() {
  const [selected, setSelected] = useState(0);
  const report = sampleReports[selected];

  return (
    <AlethiaScreen active="reports" footer="ALETHIA · COMMUNITY REPORTS">
      <div className="flex h-full min-h-0 flex-col gap-3 @xl:gap-5">
        <Reveal as="div" blur={4} y={10}>
          <ProductPageHeader
            title="Community reports"
            description="Browse reports, share a suspicious pattern, and review the context contributed by the community."
            action={<ProductButton>Add a report</ProductButton>}
          />
        </Reveal>

        <Reveal className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#263544] pb-2 @xl:pb-4" index={1} y={10}>
          <div className="flex items-center gap-1.5 @xl:gap-2">
            <ProductPill tone="signal">All reports</ProductPill>
            <ProductPill>My reports</ProductPill>
          </div>
          <div className="flex items-center gap-1.5 @xl:gap-2">
            <span className="mr-1 font-mono text-[6px] uppercase tracking-[.1em] text-[#8191a1] @xl:text-[9px]">Sort</span>
            <ProductPill tone="signal">Top</ProductPill>
            <ProductPill>Newest</ProductPill>
            <ProductPill>Oldest</ProductPill>
          </div>
        </Reveal>

        <div className="grid min-h-0 flex-1 gap-3 @xl:grid-cols-[1.05fr_.95fr] @xl:gap-5">
          <Reveal className="flex min-h-0 flex-col" index={2} y={14}>
            <ProductPanel className="flex h-full min-h-0 flex-col">
              <div className="mb-2 flex items-center justify-between gap-3 @xl:mb-4">
                <h2 className="font-mono text-[8px] font-bold uppercase tracking-[.14em] text-[#a6e86b] @xl:text-[11px]">Report feed</h2>
                <ProductPill>Illustrative examples</ProductPill>
              </div>

              {/* Selectable feed — picking a row drives the detail panel. */}
              <div className="flex min-h-0 flex-1 flex-col divide-y divide-[#263544] overflow-hidden border-y border-[#263544]">
                {sampleReports.map((item, index) => {
                  const active = index === selected;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setSelected(index)}
                      aria-pressed={active}
                      className={`relative flex min-h-0 flex-1 flex-col justify-center px-2 py-1.5 text-left transition-colors @xl:px-4 @xl:py-3 ${
                        active ? "border-l-2 border-l-[#a6e86b] bg-[#a6e86b]/[.055]" : "border-l-2 border-l-transparent hover:bg-[#a6e86b]/[.025]"
                      }`}
                    >
                      {active ? (
                        <motion.span
                          layoutId="report-active-bar"
                          aria-hidden="true"
                          className="absolute inset-y-0 left-0 w-[2px] bg-[#a6e86b]"
                          transition={{ type: "spring", stiffness: 340, damping: 32 }}
                        />
                      ) : null}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[8px] font-semibold leading-snug @xl:text-sm">{item.title}</h3>
                        <ProductPill tone={item.tone}>{item.state}</ProductPill>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[6px] text-[#8191a1] @xl:mt-2 @xl:text-[9px]">
                        <span>{item.meta}</span>
                        <span>·</span>
                        <span>Contributor username shown</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 font-mono text-[6px] text-[#8191a1] @xl:mt-3 @xl:text-[9px]">Titles and report rows above are examples, not live community data.</p>
            </ProductPanel>
          </Reveal>

          <Reveal className="flex min-h-0 flex-col" index={3} y={14}>
            <Tilt className="flex h-full min-h-0 flex-col" max={3} lift={7}>
              <ProductPanel className="relative flex h-full min-h-0 flex-col">
                <div className="flex items-start justify-between gap-3 border-b border-[#263544] pb-2 @xl:pb-4">
                  <div>
                    <p className="font-mono text-[6px] uppercase tracking-[.12em] text-[#a6e86b] @xl:text-[9px]">Illustrative report detail</p>
                    {/* Keyed so the panel re-animates when the selection moves. */}
                    <AnimatePresence mode="wait">
                      <motion.h2
                        key={report.title}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.28 }}
                        className="mt-1 text-[10px] font-bold @xl:text-lg"
                      >
                        {report.title.replace("Example · ", "")}
                      </motion.h2>
                    </AnimatePresence>
                  </div>
                  <ProductPill tone={report.tone}>{report.state.replace(" for review", "")}</ProductPill>
                </div>

                <div className="grid flex-1 grid-cols-2 gap-2 py-2 @xl:gap-3 @xl:py-4">
                  <div className="border border-[#263544] bg-[#0b1420] p-2 @xl:p-4">
                    <p className="font-mono text-[6px] uppercase text-[#8191a1] @xl:text-[9px]">Channel</p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={report.channel}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="mt-1 text-[8px] @xl:text-sm"
                      >
                        {report.channel}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <div className="border border-[#263544] bg-[#0b1420] p-2 @xl:p-4">
                    <p className="font-mono text-[6px] uppercase text-[#8191a1] @xl:text-[9px]">Pattern</p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={report.pattern}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="mt-1 text-[8px] @xl:text-sm"
                      >
                        {report.pattern}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <div className="col-span-2 border border-[#263544] bg-[#0b1420] p-2 @xl:p-4">
                    <p className="font-mono text-[6px] uppercase text-[#8191a1] @xl:text-[9px]">Report context</p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={report.context}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="mt-1 text-[7px] leading-relaxed text-[#c2ccd6] @xl:text-xs"
                      >
                        {report.context}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="border-t border-[#263544] pt-2 @xl:pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-[6px] uppercase tracking-[.1em] text-[#a6e86b] @xl:text-[9px]">Community context</p>
                    <ProductPill>{report.verdict}</ProductPill>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 @xl:mt-3">
                    {report.signals.map((signal) => (
                      <ProductPill key={signal}>{signal}</ProductPill>
                    ))}
                  </div>
                </div>
                <Glint />
              </ProductPanel>
            </Tilt>
          </Reveal>
        </div>
      </div>
    </AlethiaScreen>
  );
}
